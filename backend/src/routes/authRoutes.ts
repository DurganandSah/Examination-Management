import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getMe);

export default router;
