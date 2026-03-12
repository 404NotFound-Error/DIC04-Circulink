import { Request, Response } from "express";
import path from "path";
import { BadRequestError } from "../../utils/errors.js";
import { serverConfig } from "../../config/env.js";

export const uploadFileController = async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError("File is required");
  const uploadRoot = path.resolve(serverConfig.uploadDir);
  const relativePath = path.join(
    "/uploads",
    path.relative(uploadRoot, path.resolve(req.file.path)).split(path.sep).join("/")
  );
  res.status(201).json({ data: { path: relativePath } });
};
