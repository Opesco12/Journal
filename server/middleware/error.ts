import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type Request, type Response, type NextFunction } from "express";

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  body?: {
    message: string;
    code: number;
  };
  code?: string;
};

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log("Error occured: ", err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });
    }
  }

  const status =
    typeof err.statusCode === "number"
      ? err.statusCode
      : typeof err.status === "number"
        ? err.status
        : 500;

  res.status(status).json({
    success: false,
    message: err.body?.message ?? err.message ?? "Internal Server Error",
    // code: err.body?.code,
  });
};
