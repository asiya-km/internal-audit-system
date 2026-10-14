import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().max(254, 'Email must not exceed 254 characters').email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const uuidSchema = z.string().uuid('A valid UUID is required');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;