import { Router } from 'express';
import * as feedbackController from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { ROLES } from '../constants/roles';
import { submitFeedbackSchema } from '../validators';

const router = Router();

router.post('/', authenticate, validate(submitFeedbackSchema), feedbackController.submitFeedback);
router.get('/me', authenticate, feedbackController.getMyReceivedFeedback);
router.get(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  feedbackController.listAllFeedback
);

export default router;
