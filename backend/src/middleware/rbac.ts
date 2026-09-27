import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from './errorHandler';
import { UserRole } from '../utils/jwt';

/**
 * Role-Based Access Control (RBAC) guard middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * @param allowedRoles Array of permitted user roles ('ADMIN' | 'FACULTY' | 'STUDENT')
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized: Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient privileges to access this resource', 403));
    }

    next();
  };
};
