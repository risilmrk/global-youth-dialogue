import { Request, Response, NextFunction } from 'express';
import { Feedback } from '../models/Feedback';
import { DialogueSession } from '../models/DialogueSession';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { ROLES } from '../constants/roles';

export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, presentationId, recipientPresenterId, ratings, strengths, improvements, missingPerspectives, futureTopicSuggestions, privateNotes, visibility } = req.body;

    const session = await DialogueSession.findById(sessionId);
    if (!session) throw new NotFoundError('Dialogue session not found');

    const feedback = await Feedback.create({
      sessionId: session._id,
      presentationId,
      submittedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        country: req.user!.country,
      },
      recipientPresenter: recipientPresenterId ? { userId: recipientPresenterId } : undefined,
      ratings,
      strengths,
      improvements,
      missingPerspectives,
      futureTopicSuggestions,
      privateNotes,
      visibility: visibility || 'presenter_and_staff',
    });

    return sendSuccess(res, feedback, 'Feedback submitted successfully. Thank you for supporting peer growth!', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyReceivedFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const isStaff = req.user!.role === ROLES.ADMIN || req.user!.role === ROLES.SUPER_ADMIN || req.user!.role === ROLES.COORDINATOR;

    const query: any = {};
    if (!isStaff) {
      query.$or = [
        { 'recipientPresenter.userId': req.user!._id, visibility: { $ne: 'staff_only' } },
        { 'submittedBy.userId': req.user!._id },
      ];
    }

    const feedback = await Feedback.find(query).sort({ createdAt: -1 }).populate('sessionId', 'title category scheduledAt');
    return sendSuccess(res, feedback);
  } catch (err) {
    next(err);
  }
}

export async function listAllFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const sessionId = req.query.sessionId as string;

    const query: any = {};
    if (sessionId) query.sessionId = sessionId;

    const total = await Feedback.countDocuments(query);
    const feedbackList = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sessionId', 'title category scheduledAt');

    return sendSuccess(res, feedbackList, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}
