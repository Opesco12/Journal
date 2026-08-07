import { z } from "zod";

const imageUrlsSchema = z
  .union([
    z.string().url("Each image must be a valid URL"),
    z.array(z.string().url("Each image must be a valid URL")),
  ])
  .optional()
  .transform((val) => (!val ? [] : Array.isArray(val) ? val : [val]));

const createPostBodySchema = z.object({
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

  images: imageUrlsSchema,

  published: z.boolean().optional().default(false),

  categoryIds: z
    .union([z.string().cuid(), z.array(z.string().cuid())])
    .optional()
    .transform((val) => (!val ? [] : Array.isArray(val) ? val : [val])),
});

const postSortQueryShape = {
  sortBy: z.enum(["createdAt", "updateAt", "title"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
};

const paginationQueryShape = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
};

const postListQueryShape = {
  ...postSortQueryShape,
  ...paginationQueryShape,
};

export const createPostSchema = z.object({
  body: createPostBodySchema,
});

export const postSortSchema = z.object({
  query: z.object(postListQueryShape),
});

export const categoryPostsSortSchema = z.object({
  params: z.object({
    categoryId: z.string().trim().cuid("Invalid category ID"),
  }),
  query: z.object(postListQueryShape),
});

export const postIdParamSchema = z.object({
  params: z.object({
    postId: z.string().trim().cuid("Invalid post ID"),
  }),
});

export const UserIdParamSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),
});

export const userPostsSortSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),
  query: z.object(postListQueryShape),
});

export const searchPostsSchema = z.object({
  query: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Search title is required")
      .max(100, "Search title must be under 100 characters"),
    ...postListQueryShape,
  }),
});

export const updatePostSchema = z
  .object({
    params: z.object({
      postId: z.string().trim().cuid("Invalid post ID"),
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

export type CreatePostInput = z.infer<typeof createPostBodySchema>;
