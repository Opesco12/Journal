import { z } from "zod";

const imageUrlsSchema = z
  .union([
    z.url("Each image must be a valid URL"),
    z.array(z.string().url("Each image must be a valid URL")),
  ])
  .optional()
  .transform((val) => (!val ? [] : Array.isArray(val) ? val : [val]));

export const updatePostSchema = z
  .object({
    params: z.object({
      postId: z.string().trim().min(1, "Post id is required"),
    }),
    body: z.object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(200, "Title must be under 200 characters")
        .optional(),
      body: z
        .string()
        .trim()
        .min(1, "Body cannot be empty")
        .max(4000, "Post body must be under 4000 characters")
        .optional(),
      images: imageUrlsSchema,
    }),
    files: z.array(z.unknown()).optional().default([]),
  })
  .refine(
    ({ body, files }) =>
      body.title !== undefined ||
      body.body !== undefined ||
      body.images.length > 0 ||
      files.length > 0,
    {
      message: "At least one field or image is required to update a post",
      path: ["body"],
    },
  );
