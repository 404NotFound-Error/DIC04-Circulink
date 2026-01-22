import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/errors.js";
import { logger } from "../lib/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  logger.error({ err }, "Unhandled error");
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
};
