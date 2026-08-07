import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      files: req.files,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        error: z.treeifyError(parsed.error),
      });
    }

    const data = parsed.data as {
      body?: unknown;
      params?: typeof req.params;
      query?: typeof req.query;
    };

    if ("body" in data) {
      req.body = data.body;
    }

    if ("params" in data && data.params) {
      req.params = data.params;
    }

    if ("query" in data && data.query) {
      req.query = data.query;
    }

    next();
  };
