import { Request, Response, NextFunction } from 'express';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { hashPassword } from '../utils/password';
import { ROLES, UserRole } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

export async function submitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { applicantName, email, password, country, organization, experience, motivation, areasOfInterest, preferredLanguages } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate active applications
    const existing = await Application.findOne({
      email: normalizedEmail,
      status: { $in: ['pending', 'under_review', 'approved'] },
    });

    if (existing) {
      throw new BadRequestError('An application with this email is already on file.');
    }

    const application = await Application.create({
      applicantName,
      email: normalizedEmail,
      password: password || '',
      country,
      organization: organization || '',
      experience,
      motivation,
      areasOfInterest: areasOfInterest || [],
      preferredLanguages: preferredLanguages || ['English'],
      status: 'pending',
    });

    return sendSuccess(res, application, 'Application submitted successfully! Our secretariat will review your credentials.', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyApplication(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User required');
    const application = await Application.findOne({ email: req.user.email }).sort({ createdAt: -1 });
    return sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reviewedBy', 'name email role');

    return sendSuccess(res, applications, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await Application.findById(req.params.id).populate('reviewedBy', 'name email role');
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    return sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}

export async function reviewApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, reviewNotes, assignRole } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    application.status = status;
    application.reviewNotes = reviewNotes || application.reviewNotes;
    application.reviewedBy = req.user!._id as any;
    application.reviewedAt = new Date();

    if (assignRole === ROLES.PRESENTER) {
      application.isApprovedPresenter = true;
    }

    await application.save();

    // If approved, create or activate user account with credentials
    if (status === 'approved') {
      let user = await User.findOne({ email: application.email });
      const targetRole: UserRole = assignRole || (application.isApprovedPresenter ? ROLES.PRESENTER : ROLES.MEMBER);

      if (!user) {
        const tempPassword = application.password || 'gydeMember2026!';
        const passwordHash = await hashPassword(tempPassword);
        user = await User.create({
          name: application.applicantName,
          email: application.email,
          passwordHash,
          role: targetRole,
          status: 'active',
          emailVerified: true,
          country: application.country,
          organization: application.organization,
          interests: application.areasOfInterest,
        });
      } else {
        user.role = targetRole;
        user.status = 'active';
        user.emailVerified = true;
        await user.save();
      }

      application.linkedUser = user._id as any;
      await application.save();
    }

    await logAuditEvent({
      action: `APPLICATION_${status.toUpperCase()}`,
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'application',
      targetId: application._id.toString(),
      details: { status, reviewNotes, assignRole },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, application, `Application updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    await logAuditEvent({
      action: 'APPLICATION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'application',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Application removed successfully');
  } catch (err) {
    next(err);
  }
}

export async function applyForPresenter(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User authentication required');

    const {
      countryChapter,
      sphere,
      proposedTopic,
      experience,
      dossierUrl,
      preferredFormat,
      statementOfIntent,
    } = req.body;

    const normalizedEmail = req.user.email.toLowerCase().trim();

    let application = await Application.findOne({
      $or: [{ linkedUser: req.user._id }, { email: normalizedEmail }],
    });

    const proposalData = {
      countryChapter,
      sphere,
      proposedTopic,
      experience,
      dossierUrl: dossierUrl || '',
      preferredFormat: preferredFormat || '15-min Keynote Briefing (Opening Research)',
      statementOfIntent,
      appliedAt: new Date(),
      status: 'pending' as const,
    };

    if (application) {
      application.presenterProposal = proposalData;
      application.linkedUser = req.user._id;
      await application.save();
    } else {
      application = await Application.create({
        applicantName: req.user.name,
        email: normalizedEmail,
        country: req.user.country || countryChapter,
        organization: req.user.organization || '',
        experience,
        motivation: statementOfIntent,
        areasOfInterest: [sphere],
        preferredLanguages: req.user.languages || ['English'],
        status: 'approved', // Already an approved member
        linkedUser: req.user._id,
        isApprovedPresenter: false,
        presenterProposal: proposalData,
      });
    }

    await logAuditEvent({
      action: 'PRESENTER_APPLICATION_SUBMITTED',
      performedBy: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      targetType: 'application',
      targetId: application._id.toString(),
      details: { proposedTopic, sphere },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(
      res,
      application.presenterProposal,
      'Presenter application submitted successfully. The Coordinator Secretariat will review your credentials.',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function getPresenterStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User authentication required');

    const isPresenterRole = ['presenter', 'PRESENTER'].includes(req.user.role as string);

    const application = await Application.findOne({
      $or: [{ linkedUser: req.user._id }, { email: req.user.email.toLowerCase().trim() }],
    });

    return sendSuccess(res, {
      isPresenter: isPresenterRole || Boolean(application?.isApprovedPresenter),
      hasPendingProposal: application?.presenterProposal?.status === 'pending',
      proposal: application?.presenterProposal || null,
    });
  } catch (err) {
    next(err);
  }
}
