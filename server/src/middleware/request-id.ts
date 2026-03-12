import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

const REQUEST_ID_HEADER = "x-request-id";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incoming = req.headers[REQUEST_ID_HEADER];
  const headerValue = Array.isArray(incoming) ? incoming[0] : incoming;
  const requestId = typeof headerValue === "string" && headerValue.trim() ? headerValue.trim() : randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
};
