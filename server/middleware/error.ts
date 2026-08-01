import { type Request, type Response, type NextFunction } from "express";

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  body?: {
    message: string;
    code: number;
  };
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
