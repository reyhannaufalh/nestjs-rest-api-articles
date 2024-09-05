import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly STORE: ZodType = z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(3),
    categoryId: z.number().int(),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(3).max(255).optional(),
    content: z.string().min(3).optional(),
    categoryId: z.number().int().optional(),
  });
}
