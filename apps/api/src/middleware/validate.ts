import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

export function validateBody(schema: z.ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new ValidationError('Invalid request body', { issues: result.error.issues }));
      return;
    }
    req.body = result.data;
    next();
  };
}
