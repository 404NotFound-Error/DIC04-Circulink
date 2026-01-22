import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { listCategories } from "./service.js";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  res.json({ data: categories });
}));

export default router;
