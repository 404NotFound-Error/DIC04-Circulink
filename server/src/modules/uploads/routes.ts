import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { serverConfig } from "../../config/env.js";
import { BadRequestError } from "../../utils/errors.js";

const router = Router();

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const now = new Date();
    const dir = path.join(
      serverConfig.uploadDir,
      now.getFullYear().toString(),
      (now.getMonth() + 1).toString().padStart(2, "0"),
      now.getDate().toString().padStart(2, "0")
    );
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const base = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    const name = `${Date.now()}-${base}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) return cb(null, true);
    return cb(new BadRequestError("Unsupported file type"));
  }
});

router.post("/", requireAuth, upload.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) throw new BadRequestError("File is required");
  const relativePath = path.join(
    "/uploads",
    path.relative(serverConfig.uploadDir, req.file.path).split(path.sep).join("/")
  );
  res.status(201).json({ data: { path: relativePath } });
}));

export default router;
