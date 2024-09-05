import { z, ZodType } from 'zod';

export class CategoryValidation {
  static readonly STORE: ZodType = z.object({
    name: z.string().min(3).max(30),
    slug: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(30),
    slug: z.string().optional(),
  });
}
