import type { Request, Response } from "express";
import { getAuthenticatedUserId } from "../middleware/auth";
import { likePost, unlikePost } from "../services/likes";

export const likePostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = getAuthenticatedUserId(req);

  const likedPost = await likePost({ postId: postId as string, userId });

  console.log("Liked post: ", likedPost);
  res.json({
    success: true,
    message: "Post liked",
  });
};

export const unlikePostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = getAuthenticatedUserId(req);

  const unlikedPost = await unlikePost({ postId: postId as string, userId });

  console.log("Unliked post: ", unlikedPost);
  res.json({
    success: true,
    message: "Post unliked",
  });
};
