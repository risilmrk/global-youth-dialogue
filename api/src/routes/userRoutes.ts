import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { ROLES } from '../constants/roles';

const router = Router();

// User listing and inspection restricted strictly to administrative staff
router.get(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  userController.listUsers
);

router.get(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  userController.getUserById
);

// Authenticated user self-profile updates
router.patch('/:id/profile', authenticate, userController.updateProfile);

// Administrative operations
router.patch(
  '/:id/status',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  userController.updateUserStatus
);

router.patch(
  '/:id/role',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  userController.updateUserRole
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.SUPER_ADMIN),
  userController.deleteUser
);

export default router;
