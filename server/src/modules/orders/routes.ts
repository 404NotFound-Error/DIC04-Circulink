import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createOrderSchema, listOrdersSchema, updateOrderStatusSchema } from "./schema.js";
import { createOrderController, listOrdersController, updateOrderStatusController } from "./controller.js";

const router = Router();

router.post("/", requireAuth, validate(createOrderSchema), asyncHandler(createOrderController));

router.get("/", requireAuth, validate(listOrdersSchema), asyncHandler(listOrdersController));

router.patch("/:id/status", requireAuth, validate(updateOrderStatusSchema), asyncHandler(updateOrderStatusController));

export default router;
