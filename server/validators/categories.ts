import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name must be under 100 characters"),
  }),
});

export const categorySortSchema = z.object({
  query: z.object({
    sortBy: z.enum(["name", "id"]).optional().default("name"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    categoryId: z.string().trim().cuid("Invalid category ID"),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().trim().cuid("Invalid category ID"),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name must be under 100 characters"),
  }),
});

export const assignPostToCategorySchema = z.object({
  body: z.object({
    postId: z.string().trim().cuid("Invalid post ID"),
    categoryId: z.string().trim().cuid("Invalid category ID"),
  }),
});
