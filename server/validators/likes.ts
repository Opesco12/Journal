import { z } from "zod";

export const likePostSchema = z.object({
  body: z.object({
    postId: z.string().trim().cuid("Invalid post ID"),
  }),
});
