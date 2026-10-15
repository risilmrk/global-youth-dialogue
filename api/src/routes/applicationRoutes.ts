import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { ROLES } from '../constants/roles';
import { createApplicationSchema, reviewApplicationSchema } from '../validators';

const router = Router();

// Public application submission
router.post('/', validate(createApplicationSchema), applicationController.submitApplication);

// Member checks own application
router.get('/me', authenticate, applicationController.getMyApplication);

// Member presenter accreditation
router.post(
  '/presenter',
  authenticate,
  validate(require('../validators').presenterApplicationSchema),
  applicationController.applyForPresenter
);
router.get('/presenter/status', authenticate, applicationController.getPresenterStatus);

// Staff application review and management
router.get(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  applicationController.listApplications
);

router.get(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  applicationController.getApplicationById
);

router.patch(
  '/:id/status',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(reviewApplicationSchema),
  applicationController.reviewApplication
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  applicationController.deleteApplication
);

export default router;
