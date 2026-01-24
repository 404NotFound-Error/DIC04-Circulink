import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { listCategoriesController } from "./controller.js";

const router = Router();

router.get("/", asyncHandler(listCategoriesController));

export default router;
