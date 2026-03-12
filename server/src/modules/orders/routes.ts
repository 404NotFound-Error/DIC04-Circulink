import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { rateLimit } from "../../middleware/rate-limit.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createOrderSchema, getOrderByIdSchema, listOrdersSchema, updateOrderStatusSchema } from "./schema.js";
import { createOrderController, getOrderByIdController, listOrdersController, updateOrderStatusController } from "./controller.js";

const router = Router();
const ordersReadRateLimit = rateLimit({ scope: "orders-read", windowMs: 60_000, max: 120 });
const ordersWriteRateLimit = rateLimit({ scope: "orders-write", windowMs: 60_000, max: 30 });

router.post("/", requireAuth, ordersWriteRateLimit, validate(createOrderSchema), asyncHandler(createOrderController));

router.get("/", requireAuth, ordersReadRateLimit, validate(listOrdersSchema), asyncHandler(listOrdersController));

router.get("/:id", requireAuth, ordersReadRateLimit, validate(getOrderByIdSchema), asyncHandler(getOrderByIdController));

router.patch("/:id/status", requireAuth, ordersWriteRateLimit, validate(updateOrderStatusSchema), asyncHandler(updateOrderStatusController));

export default router;
