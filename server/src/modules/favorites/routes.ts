import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createFavoriteSchema, deleteFavoriteSchema, listFavoritesSchema } from "./schema.js";
import { addFavoriteController, listFavoritesController, removeFavoriteController } from "./controller.js";

const router = Router();

router.get("/", requireAuth, validate(listFavoritesSchema), asyncHandler(listFavoritesController));

router.post("/", requireAuth, validate(createFavoriteSchema), asyncHandler(addFavoriteController));

router.delete("/:id", requireAuth, validate(deleteFavoriteSchema), asyncHandler(removeFavoriteController));

export default router;
