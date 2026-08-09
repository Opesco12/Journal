import type { Request, Response } from "express";
import {
  deleteAdminComment,
  deleteAdminPost,
  getAdminPosts,
  getAdminStats,
  getAdminUsers,
  setAdminPostPublished,
  updateAdminUserRole,
} from "../services/admin";

export const getAdminUsersController = async (req: Request, res: Response) => {
  const { search, sortBy, sortOrder, page, limit } = req.query;
  const { users, pagination } = await getAdminUsers({
    search: search as string | undefined,
    sortBy: sortBy as "name" | "firstname" | "lastname" | "email" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
    page: page as unknown as number,
    limit: limit as unknown as number,
  });

  res.json({
    success: true,
    users,
    pagination,
  });
};

export const updateAdminUserRoleController = async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await updateAdminUserRole({
    userId: userId as string,
    role,
  });

  res.json({
    success: true,
    message: "User role updated successfully",
    user,
  });
};

export const getAdminPostsController = async (req: Request, res: Response) => {
  const { search, published, sortBy, sortOrder, page, limit } = req.query;
  const { posts, pagination } = await getAdminPosts({
    search: search as string | undefined,
    published: published as boolean | undefined,
    sortBy: sortBy as "createdAt" | "updateAt" | "title",
    sortOrder: sortOrder as "asc" | "desc",
    page: page as unknown as number,
    limit: limit as unknown as number,
  });

  res.json({
    success: true,
    posts,
    pagination,
  });
};

export const publishAdminPostController = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  const post = await setAdminPostPublished({
    postId: postId as string,
    published: true,
  });

  res.json({
    success: true,
    message: "Post published successfully",
    post,
  });
};

export const unpublishAdminPostController = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  const post = await setAdminPostPublished({
    postId: postId as string,
    published: false,
  });

  res.json({
    success: true,
    message: "Post unpublished successfully",
    post,
  });
};

export const deleteAdminPostController = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  await deleteAdminPost(postId as string);

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
};

export const deleteAdminCommentController = async (
  req: Request,
  res: Response,
) => {
  const { commentId } = req.params;
  await deleteAdminComment(commentId as string);

  res.json({
    success: true,
    message: "Comment deleted successfully",
  });
};

export const getAdminStatsController = async (_req: Request, res: Response) => {
  const stats = await getAdminStats();

  res.json({
    success: true,
    stats,
  });
};
