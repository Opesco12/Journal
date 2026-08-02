import { type NextFunction, type Request, type Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export type HttpError = Error & {
  status?: number;
  statusCode?: number;
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    const error: HttpError = new Error("Unauthenticated");
    error.status = 401;

    return next(error);
  }

  req.user = session.user;

  next();
};

//admin middleware
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  next();
};
