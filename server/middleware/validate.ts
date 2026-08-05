import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        error: z.treeifyError(parsed.error),
      });
    }

    req.body = parsed.data;
    next();
  };
