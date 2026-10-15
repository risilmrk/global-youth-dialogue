import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { ROLES } from '../constants/roles';
import userRoutes from './userRoutes';
import applicationRoutes from './applicationRoutes';
import topicRoutes from './topicRoutes';
import sessionRoutes from './sessionRoutes';
import publicationRoutes from './publicationRoutes';
import feedbackRoutes from './feedbackRoutes';

const router = Router();

router.use(authenticate);
router.use(requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/audit-logs', adminController.getAuditLogs);

// Mount resource routers under /admin to serve admin web client
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/topics', topicRoutes);
router.use('/sessions', sessionRoutes);
router.use('/publications', publicationRoutes);
router.use('/feedback', feedbackRoutes);

export default router;

