import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createOrderSchema, listOrdersSchema, updateOrderStatusSchema } from "./schema.js";
import { createOrder, listOrders, updateOrderStatus } from "./service.js";

const router = Router();

router.post("/", requireAuth, validate(createOrderSchema), asyncHandler(async (req, res) => {
  const order = await createOrder(req.user!.id, req.body);
  res.status(201).json({ data: order });
}));

router.get("/", requireAuth, validate(listOrdersSchema), asyncHandler(async (req, res) => {
  const result = await listOrders(req.user!.id, {
    role: req.query.role as any,
    status: req.query.status as any,
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined
  });
  res.json({ data: result.orders, meta: { page: result.page, pageSize: result.pageSize, total: result.total } });
}));

router.patch("/:id/status", requireAuth, validate(updateOrderStatusSchema), asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.user!.id, req.params.id, req.body.status);
  res.json({ data: order });
}));

export default router;
