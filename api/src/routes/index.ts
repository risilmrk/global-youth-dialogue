import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import userRoutes from './userRoutes';
import sessionRoutes from './sessionRoutes';
import topicRoutes from './topicRoutes';
import feedbackRoutes from './feedbackRoutes';
import publicationRoutes from './publicationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GYDE API',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/topics', topicRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/publications', publicationRoutes);
router.use('/admin', adminRoutes);

export default router;
