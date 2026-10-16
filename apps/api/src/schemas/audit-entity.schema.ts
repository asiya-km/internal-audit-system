import { z } from 'zod';
import { paginationSchema, uuidSchema } from './auth.schema.js';

export const entityTypeSchema = z.enum([
  'DEPARTMENT',
  'BUSINESS_PROCESS',
  'INFORMATION_SYSTEM',
  'PROJECT',
  'PROGRAM',
  'OTHER',
]);

export const entityStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);

export const sortOrderSchema = z.enum(['asc', 'desc']);

export const listAuditEntitiesSchema = paginationSchema.extend({
  search: z.string().max(200).optional(),
  entityType: entityTypeSchema.optional(),
  status: entityStatusSchema.optional(),
  parentId: uuidSchema.optional(),
});

export const createAuditEntitySchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must not exceed 50 characters').trim(),
  name: z.string().min(1, 'Name is required').max(200, 'Name must not exceed 200 characters').trim(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  entityType: entityTypeSchema,
  parentId: uuidSchema.optional(),
  ownerName: z.string().max(200).optional(),
  responsibleName: z.string().max(200).optional(),
  classification: z.string().max(100).optional(),
});

export const updateAuditEntitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  entityType: entityTypeSchema.optional(),
  parentId: uuidSchema.nullable().optional(),
  ownerName: z.string().max(200).nullable().optional(),
  responsibleName: z.string().max(200).nullable().optional(),
  classification: z.string().max(100).nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' },
);

export const updateEntityStatusSchema = z.object({
  status: entityStatusSchema,
});

export type CreateAuditEntityInput = z.infer<typeof createAuditEntitySchema>;
export type UpdateAuditEntityInput = z.infer<typeof updateAuditEntitySchema>;
export type UpdateEntityStatusInput = z.infer<typeof updateEntityStatusSchema>;
export type ListAuditEntitiesInput = z.infer<typeof listAuditEntitiesSchema>;
