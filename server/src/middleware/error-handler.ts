import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/errors.js";
import { logger } from "../lib/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as { type?: string }).type === "entity.too.large"
  ) {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Image payload too large. Please upload files first (do not send base64 in JSON).",
        requestId: _req.requestId
      }
    });
  }
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: { code: "VALIDATION_ERROR", message: err.message, requestId: _req.requestId } });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, requestId: _req.requestId }
    });
  }
  logger.error({ err, requestId: _req.requestId }, "Unhandled error");
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Internal server error", requestId: _req.requestId }
  });
};
