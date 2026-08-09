import { z } from "zod";

const paginationQueryShape = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
};

const sortOrderSchema = z.enum(["asc", "desc"]).optional().default("desc");

export const adminUsersSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    sortBy: z
      .enum(["name", "firstname", "lastname", "email", "createdAt"])
      .optional()
      .default("createdAt"),
    sortOrder: sortOrderSchema,
    ...paginationQueryShape,
  }),
});

export const adminUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum(["user", "admin"]),
  }),
});

export const adminPostsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    published: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    sortBy: z
      .enum(["createdAt", "updateAt", "title"])
      .optional()
      .default("createdAt"),
    sortOrder: sortOrderSchema,
    ...paginationQueryShape,
  }),
});

export const adminPostIdSchema = z.object({
  params: z.object({
    postId: z.string().trim().cuid("Invalid post ID"),
  }),
});

export const adminCommentIdSchema = z.object({
  params: z.object({
    commentId: z.string().trim().cuid("Invalid comment ID"),
  }),
});
