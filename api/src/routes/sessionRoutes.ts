import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { ROLES } from '../constants/roles';
import { createSessionSchema, updateSessionSchema } from '../validators';

const router = Router();

// Sessions can be viewed publicly (with sensitive links hidden unless authenticated)
router.get('/', optionalAuthenticate, sessionController.listSessions);
router.get('/:id', optionalAuthenticate, sessionController.getSessionById);

// Staff session creation, editing and deletion
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(createSessionSchema),
  sessionController.createSession
);

router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(updateSessionSchema),
  sessionController.updateSession
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  sessionController.deleteSession
);

export default router;
