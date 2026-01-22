import { AnyZodObject } from "zod";
import { RequestHandler } from "express";
import { BadRequestError } from "../utils/errors.js";

export const validate = (schema: AnyZodObject): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join("; ");
    return next(new BadRequestError(message));
  }
  req.body = result.data.body;
  req.query = result.data.query;
  req.params = result.data.params;
  return next();
};
