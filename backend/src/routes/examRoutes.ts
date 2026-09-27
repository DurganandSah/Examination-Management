import { Router } from 'express';
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addQuestionsToExam,
} from '../controllers/examController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Apply authenticateUser middleware to all exam routes
router.use(authenticateUser);

// GET routes: Accessible to all authenticated users (Students, Faculty, Admin)
router.get('/', getAllExams);
router.get('/:id', getExamById);

// Protected routes: Restricted to FACULTY and ADMIN roles
router.post('/', authorizeRoles('FACULTY', 'ADMIN'), createExam);
router.put('/:id', authorizeRoles('FACULTY', 'ADMIN'), updateExam);
router.delete('/:id', authorizeRoles('FACULTY', 'ADMIN'), deleteExam);
router.post('/:id/questions', authorizeRoles('FACULTY', 'ADMIN'), addQuestionsToExam);

export default router;
