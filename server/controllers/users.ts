import type { Request, Response } from "express";
import { searchUsersByName } from "../services/user";

export const searchUsersController = async (req: Request, res: Response) => {
  const { name, sortBy, sortOrder, page, limit } = req.query;
  const { users, pagination } = await searchUsersByName({
    name: name as string,
    sortBy: sortBy as "name" | "firstname" | "lastname" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
    page: page as number,
    limit: limit as number,
  });

  res.json({
    success: true,
    users,
    pagination,
  });
};
