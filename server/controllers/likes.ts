import type { Request, Response } from "express";
import { likePost } from "../services/likes";

export const likePostController = async (req: Request, res: Response) => {
  const { postId, userId } = req.body;

  const likedPost = await likePost({ postId, userId });

  console.log("Liked post: ", likedPost);
  res.json({
    success: true,
    message: "Post liked",
  });
};
