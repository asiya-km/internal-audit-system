import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

function formatIssues(error: z.ZodError) {
  return { issues: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) };
}

export function validateBody(schema: z.ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new ValidationError('Invalid request body', formatIssues(result.error)));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: z.ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new ValidationError('Invalid query parameters', formatIssues(result.error)));
      return;
    }
    req.query = result.data as Record<string, string>;
    next();
  };
}

export function validateParams(schema: z.ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(new ValidationError('Invalid path parameters', formatIssues(result.error)));
      return;
    }
    req.params = result.data as Record<string, string>;
    next();
  };
}