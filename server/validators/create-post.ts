import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),

  body: z
    .string()
    .trim()
    .min(1, "Body is required")
    .max(4000, "Post body must be under 10000 characters"),

  images: z
    .union([
      z.string().url("Each image must be a valid URL"),
      z.array(z.string().url("Each image must be a valid URL")),
    ])
    .optional()
    .transform((val) => (!val ? [] : Array.isArray(val) ? val : [val])),

  published: z.boolean().optional().default(false),

  categoryIds: z
    .union([z.string().cuid(), z.array(z.string().cuid())])
    .optional()
    .transform((val) => (!val ? [] : Array.isArray(val) ? val : [val])),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
