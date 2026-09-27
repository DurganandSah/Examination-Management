import { Router } from 'express';
import authRoutes from './authRoutes';
import questionRoutes from './questionRoutes';
import examRoutes from './examRoutes';
import submissionRoutes from './submissionRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/exams', examRoutes);
router.use('/submissions', submissionRoutes);

export default router;
