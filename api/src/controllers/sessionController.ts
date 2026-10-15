import { Request, Response, NextFunction } from 'express';
import { DialogueSession } from '../models/DialogueSession';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { ROLES } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

export async function listSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { motion: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await DialogueSession.countDocuments(query);
    const sessions = await DialogueSession.find(query)
      .populate('assignedCoordinator', 'name email role')
      .sort({ scheduledAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const isMemberOrStaff = !!req.user;

    // Secure sensitive meeting links and private recordings from unauthorized public visitors
    const sanitized = sessions.map((s) => {
      const obj = s.toJSON();
      if (!isMemberOrStaff) {
        delete (obj as any).meetingUrl;
        if (obj.recordingVisibility !== 'public') {
          delete (obj as any).recordingUrl;
        }
      }
      return obj;
    });

    return sendSuccess(res, sanitized, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getSessionById(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await DialogueSession.findById(req.params.id)
      .populate('assignedCoordinator', 'name email role');
    if (!session) throw new NotFoundError('Session not found');

    const obj = session.toJSON();
    const isMemberOrStaff = !!req.user;

    if (!isMemberOrStaff) {
      delete (obj as any).meetingUrl;
      if (obj.recordingVisibility !== 'public') {
        delete (obj as any).recordingUrl;
      }
    }

    return sendSuccess(res, obj);
  } catch (err) {
    next(err);
  }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await DialogueSession.create({
      ...req.body,
      createdBy: req.user!._id,
    });

    await logAuditEvent({
      action: 'SESSION_CREATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: session._id.toString(),
      details: { title: session.title, scheduledAt: session.scheduledAt },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, session, 'Session scheduled successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await DialogueSession.findById(req.params.id);
    if (!session) throw new NotFoundError('Session not found');

    const userRole = (req.user?.role || '').toLowerCase();
    const isStaffAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isCoordinator = userRole === 'coordinator';

    // Verify coordinator access
    if (isCoordinator && !isStaffAdmin) {
      const isAssigned =
        session.assignedCoordinator &&
        session.assignedCoordinator.toString() === req.user?._id.toString();
      const isCreator =
        session.createdBy &&
        session.createdBy.toString() === req.user?._id.toString();
      const isUnassigned = !session.assignedCoordinator;

      if (!isAssigned && !isCreator && !isUnassigned) {
        throw new ForbiddenError('You can only edit sessions assigned to you or created by you.');
      }
    }

    const updateData = { ...req.body };
    if (updateData.assignedCoordinatorId && isStaffAdmin) {
      updateData.assignedCoordinator = updateData.assignedCoordinatorId;
      delete updateData.assignedCoordinatorId;
    }

    Object.assign(session, updateData);
    await session.save();

    await logAuditEvent({
      action: 'SESSION_UPDATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: session._id.toString(),
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, session, 'Session updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await DialogueSession.findByIdAndDelete(req.params.id);
    if (!session) throw new NotFoundError('Session not found');

    await logAuditEvent({
      action: 'SESSION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Session deleted successfully');
  } catch (err) {
    next(err);
  }
}
