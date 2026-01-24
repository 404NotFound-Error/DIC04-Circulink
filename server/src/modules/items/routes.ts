import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { createItemSchema, getItemSchema, listItemsSchema, updateItemSchema } from "./schema.js";
import {
  createItemController,
  deleteItemController,
  getItemController,
  listItemsController,
  updateItemController
} from "./controller.js";

const router = Router();

router.get("/", validate(listItemsSchema), asyncHandler(listItemsController));

router.get("/:id", validate(getItemSchema), asyncHandler(getItemController));

router.post("/", requireAuth, validate(createItemSchema), asyncHandler(createItemController));

router.patch("/:id", requireAuth, validate(updateItemSchema), asyncHandler(updateItemController));

router.delete("/:id", requireAuth, validate(getItemSchema), asyncHandler(deleteItemController));

export default router;
