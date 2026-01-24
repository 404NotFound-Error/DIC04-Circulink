import { Request, Response } from "express";
import path from "path";
import { BadRequestError } from "../../utils/errors.js";
import { serverConfig } from "../../config/env.js";

export const uploadFileController = async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError("File is required");
  const relativePath = path.join(
    "/uploads",
    path.relative(serverConfig.uploadDir, req.file.path).split(path.sep).join("/")
  );
  res.status(201).json({ data: { path: relativePath } });
};
