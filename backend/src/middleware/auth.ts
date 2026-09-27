import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken, UserRole } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Extracts Bearer token from Authorization header and verifies it via verifyToken.
 * Attaches decoded user object to req.user context.
 */
export const authenticateUser = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: Missing or invalid authorization token', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Unauthorized: Token string is empty', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

// Alias export for backward compatibility
export const authenticateJwt = authenticateUser;
