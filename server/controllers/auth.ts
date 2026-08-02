import type { Request, Response } from "express";
import { loginUser, logoutUser, registerUser } from "../services/auth";

export const register = async (req: Request, res: Response) => {
  const { email, password, firstname, lastname } = req.body;

  const user = await registerUser({
    email,
    password,
    firstname,
    lastname,
  });

  console.log("user created: ", user);

  res.json({ success: true, message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const session = await loginUser({
    email,
    password,
  });

  console.log("session created: ", session);

  res.json({
    success: true,
    message: "User logged in successfully",
    ...session,
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = req.user;

  // if (!user) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "Unauthenticated",
  //   });
  // }

  res.json({
    success: true,
    user,
  });
};

export const logout = async (req: Request, res: Response) => {
  await logoutUser(req.headers);

  res.json({ success: true, message: "User logged out successfully" });
};
