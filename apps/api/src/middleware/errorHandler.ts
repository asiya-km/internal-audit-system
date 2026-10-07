import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 'NOT_FOUND', 'The requested resource was not found', 404);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 'VALIDATION_ERROR', 'Invalid request data', 400, {
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
    return;
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: config.isProduction ? undefined : err.stack,
  });

  sendError(
    res,
    'INTERNAL_ERROR',
    config.isProduction ? 'An unexpected error occurred' : err.message,
    500,
  );
}
