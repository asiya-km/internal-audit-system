import type { Response } from 'express';
import type { ApiResponse } from '@iams/shared';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const body: ApiResponse<T> = { success: true, data };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: Record<string, unknown>,
): Response {
  const body: ApiResponse<never> = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
  return res.status(statusCode).json(body);
}
