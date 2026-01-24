import { Request, Response } from "express";
import { createOrder, listOrders, updateOrderStatus } from "./service.js";

export const createOrderController = async (req: Request, res: Response) => {
  const order = await createOrder(req.user!.id, req.body);
  res.status(201).json({ data: order });
};

export const listOrdersController = async (req: Request, res: Response) => {
  const result = await listOrders(req.user!.id, {
    role: req.query.role as any,
    status: req.query.status as any,
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined
  });
  res.json({ data: result.orders, meta: { page: result.page, pageSize: result.pageSize, total: result.total } });
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(req.user!.id, req.params.id, req.body.status);
  res.json({ data: order });
};
