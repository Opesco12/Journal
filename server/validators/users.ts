import { z } from "zod";

export const searchUsersSchema = z.object({
  query: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Search name is required")
      .max(100, "Search name must be under 100 characters"),
  }),
});
