import type { Request, Response } from "express";
import { getAuthenticatedUserId, type HttpError } from "../middleware/auth";
import { searchUsersByName, updateUserProfileImage } from "../services/user";

export const searchUsersController = async (req: Request, res: Response) => {
  const { name, sortBy, sortOrder, page, limit } = req.query;
  const { users, pagination } = await searchUsersByName({
    name: name as string,
    sortBy: sortBy as "name" | "firstname" | "lastname" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
    page: Number(page),
    limit: Number(limit),
  });

  res.json({
    success: true,
    users,
    pagination,
  });
};

export const uploadProfileImageController = async (
  req: Request,
  res: Response,
) => {
  const userId = getAuthenticatedUserId(req);
  const file = req.file;

  if (!file) {
    const error: HttpError = new Error("Profile image is required");
    error.status = 400;
    throw error;
  }

  const user = await updateUserProfileImage({ userId, file });

  res.json({
    success: true,
    message: "Profile image uploaded successfully",
    user,
  });
};
