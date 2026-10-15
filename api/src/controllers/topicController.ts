import { Request, Response, NextFunction } from 'express';
import { Topic } from '../models/Topic';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { logAuditEvent } from '../utils/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function listTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    if (category && category !== 'all') query.category = category;

    // Search filter
    const searchConditions: any[] = [];
    if (search) {
      searchConditions.push(
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      );
    }

    // Role-based visibility logic:
    // - Regular users only see approved, published, completed (and scheduled) topics
    //   (plus their own proposed topics if authenticated)
    // - Coordinators see approved, published, completed, scheduled topics, PLUS assigned topics
    //   (and their own proposed topics)
    // - Admins and Super Admins see all topics
    const userRole = (req.user?.role || '').toLowerCase();
    const isStaffAdmin = ['admin', 'super_admin'].includes(userRole);
    const isCoordinator = userRole === 'coordinator';
    const publicStatuses = ['approved', 'published', 'completed', 'scheduled'];

    const roleConditions: any[] = [];

    if (isStaffAdmin) {
      // Admin sees everything; if specific status is requested, apply it
      if (status && status !== 'all') {
        query.status = status;
      }
    } else if (isCoordinator) {
      // Coordinator sees:
      // 1. approved / published / completed / scheduled
      // 2. OR assigned to this coordinator
      // 3. OR proposed by this coordinator
      const coordinatorBranches: any[] = [
        { status: { $in: publicStatuses } },
        { assignedCoordinator: req.user!._id },
        { 'proposedBy.userId': req.user!._id },
      ];

      if (status && status !== 'all') {
        roleConditions.push({ status });
        roleConditions.push({ $or: coordinatorBranches });
      } else {
        roleConditions.push({ $or: coordinatorBranches });
      }
    } else {
      // Regular user / Member / Presenter / Public
      if (req.user) {
        // Authenticated user can see public statuses OR their own proposed topics
        const userBranches: any[] = [
          { status: { $in: publicStatuses } },
          { 'proposedBy.userId': req.user._id },
        ];
        if (status && status !== 'all') {
          roleConditions.push({ status });
          roleConditions.push({ $or: userBranches });
        } else {
          roleConditions.push({ $or: userBranches });
        }
      } else {
        // Unauthenticated public visitor
        if (status && status !== 'all') {
          if (publicStatuses.includes(status)) {
            query.status = status;
          } else {
            query.status = { $in: [] }; // No match
          }
        } else {
          query.status = { $in: publicStatuses };
        }
      }
    }

    // Combine all conditions cleanly into query.$and if needed
    const andClauses: any[] = [];
    if (searchConditions.length > 0) {
      andClauses.push({ $or: searchConditions });
    }
    if (roleConditions.length > 0) {
      andClauses.push(...roleConditions);
    }

    if (andClauses.length > 0) {
      query.$and = andClauses;
    }

    const total = await Topic.countDocuments(query);
    const topics = await Topic.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedCoordinator', 'name email');

    return sendSuccess(res, topics, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getTopicById(req: Request, res: Response, next: NextFunction) {
  try {
    const topic = await Topic.findById(req.params.id).populate('assignedCoordinator', 'name email');
    if (!topic) throw new NotFoundError('Topic not found');

    const userRole = (req.user?.role || '').toLowerCase();
    const isStaffAdmin = ['admin', 'super_admin'].includes(userRole);
    const isCoordinator = userRole === 'coordinator';
    const publicStatuses = ['approved', 'published', 'completed', 'scheduled'];

    const isPublicVisible = publicStatuses.includes(topic.status);
    const isOwner =
      req.user &&
      topic.proposedBy?.userId &&
      topic.proposedBy.userId.toString() === req.user._id.toString();
    const isAssigned =
      isCoordinator &&
      topic.assignedCoordinator &&
      topic.assignedCoordinator.toString() === req.user?._id.toString();

    if (!isStaffAdmin && !isPublicVisible && !isOwner && !isAssigned) {
      throw new ForbiddenError('You do not have permission to view this topic proposal');
    }

    return sendSuccess(res, topic);
  } catch (err) {
    next(err);
  }
}

export async function proposeTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      subtopics,
      subtopic,
      motion,
      format,
      regionalPerspective,
      sources,
      isCustom,
      interestedToPresent,
    } = req.body;
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `topic-${Date.now()}`;

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await Topic.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const topic = await Topic.create({
      title,
      titleAr: titleAr || '',
      slug,
      description,
      descriptionAr: descriptionAr || '',
      category,
      subtopics: subtopics || [],
      subtopic: subtopic || '',
      motion: motion || '',
      format: format || 'Academic Discussion / Policy Roundtable',
      regionalPerspective: regionalPerspective || '',
      sources: sources || '',
      isCustom: Boolean(isCustom),
      interestedToPresent: Boolean(interestedToPresent),
      status: 'proposed',
      proposedBy: req.user
        ? {
            userId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            country: req.user.country,
          }
        : undefined,
    });

    if (req.user) {
      await logAuditEvent({
        action: 'TOPIC_PROPOSED',
        performedBy: {
          userId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
        targetType: 'topic',
        targetId: topic._id.toString(),
        details: { title: topic.title, category: topic.category },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    }

    return sendSuccess(res, topic, 'Motion proposed into the dialogue pipeline', 201);
  } catch (err) {
    next(err);
  }
}

export async function upvoteTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) throw new NotFoundError('Topic not found');

    topic.upvotesCount = (topic.upvotesCount || 0) + 1;
    await topic.save();

    return sendSuccess(res, topic, 'Vote counted in community ballot');
  } catch (err) {
    next(err);
  }
}

export async function updateTopicStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      status,
      reviewNotes,
      assignedCoordinatorId,
      relatedSessionId,
      title,
      description,
      motion,
      format,
      subtopic,
    } = req.body;

    const topic = await Topic.findById(req.params.id);
    if (!topic) throw new NotFoundError('Topic not found');

    const userRole = (req.user?.role || '').toLowerCase();
    const isStaffAdmin = ['admin', 'super_admin'].includes(userRole);
    const isCoordinator = userRole === 'coordinator';

    // If coordinator, verify assignment or ownership
    if (!isStaffAdmin && isCoordinator) {
      const isAssigned =
        topic.assignedCoordinator &&
        topic.assignedCoordinator.toString() === req.user?._id.toString();
      const isOwner =
        topic.proposedBy?.userId &&
        topic.proposedBy.userId.toString() === req.user?._id.toString();

      if (!isAssigned && !isOwner) {
        throw new ForbiddenError('You can only edit topics assigned to you or proposed by you.');
      }
    }

    if (status) topic.status = status;
    if (title) topic.title = title;
    if (description) topic.description = description;
    if (motion !== undefined) topic.motion = motion;
    if (format !== undefined) topic.format = format;
    if (subtopic !== undefined) topic.subtopic = subtopic;
    if (reviewNotes !== undefined) topic.reviewNotes = reviewNotes;
    if (assignedCoordinatorId && isStaffAdmin) topic.assignedCoordinator = assignedCoordinatorId as any;
    if (relatedSessionId) topic.relatedSession = relatedSessionId as any;

    await topic.save();

    await logAuditEvent({
      action: `TOPIC_UPDATED_${(status || topic.status).toUpperCase()}`,
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'topic',
      targetId: topic._id.toString(),
      details: { status: topic.status, reviewNotes, title: topic.title },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, topic, 'Topic updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) throw new NotFoundError('Topic not found');

    await logAuditEvent({
      action: 'TOPIC_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'topic',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Topic removed successfully');
  } catch (err) {
    next(err);
  }
}
