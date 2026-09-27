import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils';
import { config } from '../config/env';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (!config.isProduction) {
    console.error('💥 Error handler caught:', err);
  }

  return sendError(res, message, statusCode, config.isProduction ? undefined : err.stack);
};
