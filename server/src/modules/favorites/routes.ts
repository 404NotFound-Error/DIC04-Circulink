import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createFavoriteSchema, deleteFavoriteSchema, listFavoritesSchema } from "./schema.js";
import { addFavorite, listFavorites, removeFavorite } from "./service.js";

const router = Router();

router.get("/", requireAuth, validate(listFavoritesSchema), asyncHandler(async (req, res) => {
  const { favorites, total, page, pageSize } = await listFavorites(
    req.user!.id,
    req.query.page ? Number(req.query.page) : undefined,
    req.query.pageSize ? Number(req.query.pageSize) : undefined
  );
  res.json({ data: favorites, meta: { page, pageSize, total } });
}));

router.post("/", requireAuth, validate(createFavoriteSchema), asyncHandler(async (req, res) => {
  const favorite = await addFavorite(req.user!.id, req.body.itemId);
  res.status(201).json({ data: favorite });
}));

router.delete("/:id", requireAuth, validate(deleteFavoriteSchema), asyncHandler(async (req, res) => {
  await removeFavorite(req.user!.id, req.params.id);
  res.status(204).send();
}));

export default router;
