import type { Request, Response } from "express";
import { searchUsersByName } from "../services/user";

export const searchUsersController = async (req: Request, res: Response) => {
  const { name } = req.query;
  const users = await searchUsersByName(name as string);

  res.json({
    success: true,
    users,
  });
};
