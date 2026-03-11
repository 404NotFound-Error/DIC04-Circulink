import { Request, Response } from "express";
import { Condition, ItemStatus } from "@prisma/client";
import { createItem, deleteItem, getItemById, listItems, updateItem } from "./service.js";

export const listItemsController = async (req: Request, res: Response) => {
  const condition = req.query.condition as Condition | undefined;
  const status = req.query.status as ItemStatus | undefined;
  const sort = req.query.sort as "price" | "createdAt" | undefined;
  const order = req.query.order as "asc" | "desc" | undefined;

  const { items, total, page, pageSize } = await listItems({
    categoryId: req.query.categoryId as string | undefined,
    q: req.query.q as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    condition,
    status,
    sellerId: req.query.sellerId as string | undefined,
    sort,
    order,
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined
  });
  res.json({ data: items, meta: { page, pageSize, total } });
};

export const getItemController = async (req: Request, res: Response) => {
  const item = await getItemById(req.params.id);
  res.json({ data: item });
};

export const createItemController = async (req: Request, res: Response) => {
  const item = await createItem(req.user!.id, req.body);
  res.status(201).json({ data: item });
};

export const updateItemController = async (req: Request, res: Response) => {
  const item = await updateItem(req.params.id, req.user!.id, req.body);
  res.json({ data: item });
};

export const deleteItemController = async (req: Request, res: Response) => {
  await deleteItem(req.params.id, req.user!.id);
  res.status(204).send();
};
