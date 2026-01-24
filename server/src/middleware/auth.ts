import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { AuthError } from "../utils/errors.js";
import { env } from "../config/env.js";

export type AuthUser = {
  id: string;
  email?: string;
  role?: string;
};

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = payload;
  } catch (err) {
    return next(new AuthError("Invalid token"));
  }
  return next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      const token = header.slice(7);
      try {
        const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
        req.user = payload;
      } catch {
        return next(new AuthError("Invalid token"));
      }
    }
  }
  if (!req.user) return next(new AuthError());
  return next();
};
