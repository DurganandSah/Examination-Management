import { Router } from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Apply authenticateUser middleware to all question routes
router.use(authenticateUser);

// All routes restricted to FACULTY and ADMIN roles
router.post('/', authorizeRoles('FACULTY', 'ADMIN'), createQuestion);
router.get('/', authorizeRoles('FACULTY', 'ADMIN'), getQuestions);
router.get('/:id', authorizeRoles('FACULTY', 'ADMIN'), getQuestionById);
router.put('/:id', authorizeRoles('FACULTY', 'ADMIN'), updateQuestion);
router.delete('/:id', authorizeRoles('FACULTY', 'ADMIN'), deleteQuestion);

export default router;
