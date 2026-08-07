import type { Request, Response } from "express";
import {
  bookmarkPost,
  getUserBookmarks,
  unbookmarkPost,
} from "../services/bookmark";
import { getAuthenticatedUserId } from "../middleware/auth";

export const bookmarkController = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { postId } = req.params;
  const bookmarkedPost = await bookmarkPost(userId, postId as string);
  res.json({
    success: true,
    bookmarkedPost,
  });
};

export const removeBookmarkController = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { postId } = req.params;
  const unbookmarkedPost = await unbookmarkPost(userId, postId as string);
  res.json({
    success: true,
  });
};

export const userBookmarksController = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { sortBy, sortOrder, page, limit } = req.query;
  const { posts, pagination } = await getUserBookmarks({
    userId,
    sortBy: sortBy as "createdAt" | "updateAt" | "title",
    sortOrder: sortOrder as "asc" | "desc",
    page: page as number,
    limit: limit as number,
  });

  res.json({
    success: true,
    posts,
    pagination,
  });
};
