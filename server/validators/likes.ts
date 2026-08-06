import { z } from "zod";

export const likePostSchema = z.object({
  body: z.object({
    postId: z.string().trim().cuid("Invalid post ID"),
    userId: z.string().trim().min(1, "User id is required"),
  }),
});
