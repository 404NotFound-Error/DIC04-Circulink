import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { createItemSchema, getItemSchema, listItemsSchema, updateItemSchema } from "./schema.js";
import { createItem, deleteItem, getItemById, listItems, updateItem } from "./service.js";

const router = Router();

router.get("/", validate(listItemsSchema), asyncHandler(async (req, res) => {
  const { items, total, page, pageSize } = await listItems({
    categoryId: req.query.categoryId as string | undefined,
    q: req.query.q as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    condition: req.query.condition as any,
    status: req.query.status as any,
    sellerId: req.query.sellerId as string | undefined,
    sort: req.query.sort as any,
    order: req.query.order as any,
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined
  });
  res.json({ data: items, meta: { page, pageSize, total } });
}));

router.get("/:id", validate(getItemSchema), asyncHandler(async (req, res) => {
  const item = await getItemById(req.params.id);
  res.json({ data: item });
}));

router.post("/", requireAuth, validate(createItemSchema), asyncHandler(async (req, res) => {
  const item = await createItem(req.user!.id, req.body);
  res.status(201).json({ data: item });
}));

router.patch("/:id", requireAuth, validate(updateItemSchema), asyncHandler(async (req, res) => {
  const item = await updateItem(req.params.id, req.user!.id, req.body);
  res.json({ data: item });
}));

router.delete("/:id", requireAuth, validate(getItemSchema), asyncHandler(async (req, res) => {
  await deleteItem(req.params.id, req.user!.id);
  res.status(204).send();
}));

export default router;
