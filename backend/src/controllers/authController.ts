import { Request, Response, NextFunction } from 'express';
import { userStore } from '../models/userStore';
import { hashPassword, comparePassword, generateToken, sendSuccess, UserRole } from '../utils';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Handles user registration
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const validRoles: UserRole[] = ['STUDENT', 'FACULTY', 'ADMIN'];
    const userRole: UserRole = role && validRoles.includes(role) ? role : 'STUDENT';

    const existingUser = await userStore.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const passwordHash = await hashPassword(password);
    const newUser = await userStore.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: userRole,
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      },
      'User registered successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user login
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await userStore.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Gets active authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized access', 401);
    }

    const user = await userStore.findById(req.user.userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      'Current user profile retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};
