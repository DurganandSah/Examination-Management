import { Router } from 'express';
import {
  startExamAttempt,
  autosaveProgress,
  submitExam,
  getSubmissionResults,
} from '../controllers/submissionController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Apply authenticateUser middleware to all submission routes
router.use(authenticateUser);

// Student execution routes
router.post('/start', authorizeRoles('STUDENT'), startExamAttempt);
router.post('/autosave', authorizeRoles('STUDENT'), autosaveProgress);
router.post('/submit', authorizeRoles('STUDENT'), submitExam);

// Results endpoint: Accessible to all roles (STUDENT can only access their own in controller logic)
router.get('/results/:attemptId', getSubmissionResults);

export default router;
