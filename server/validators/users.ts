import { z } from "zod";

export const searchUsersSchema = z.object({
  query: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Search name is required")
      .max(100, "Search name must be under 100 characters"),
    sortBy: z
      .enum(["name", "firstname", "lastname", "createdAt"])
      .optional()
      .default("name"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});
