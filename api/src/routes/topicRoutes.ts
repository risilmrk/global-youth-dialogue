import { Router } from 'express';
import * as topicController from '../controllers/topicController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { ROLES } from '../constants/roles';
import { createTopicSchema, updateTopicStatusSchema } from '../validators';

const router = Router();

router.get('/', optionalAuthenticate, topicController.listTopics);
router.get('/:id', optionalAuthenticate, topicController.getTopicById);

// Topic proposal (authenticated debaters or public proposal if enabled)
router.post('/', authenticate, validate(createTopicSchema), topicController.proposeTopic);

// Topic upvoting
router.post('/:id/upvote', authenticate, topicController.upvoteTopic);

// Staff moderation & pipeline management
router.patch(
  '/:id/status',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(updateTopicStatusSchema),
  topicController.updateTopicStatus
);

router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(updateTopicStatusSchema),
  topicController.updateTopicStatus
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  topicController.deleteTopic
);

export default router;
