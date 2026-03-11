import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createOrderSchema, getOrderByIdSchema, listOrdersSchema, updateOrderStatusSchema } from "./schema.js";
import { createOrderController, getOrderByIdController, listOrdersController, updateOrderStatusController } from "./controller.js";

const router = Router();

router.post("/", requireAuth, validate(createOrderSchema), asyncHandler(createOrderController));

router.get("/", requireAuth, validate(listOrdersSchema), asyncHandler(listOrdersController));

router.get("/:id", requireAuth, validate(getOrderByIdSchema), asyncHandler(getOrderByIdController));

router.patch("/:id/status", requireAuth, validate(updateOrderStatusSchema), asyncHandler(updateOrderStatusController));

export default router;
