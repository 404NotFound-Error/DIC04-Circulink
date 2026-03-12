import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { suggestItemController } from "./controller.js";
import { itemSuggestSchema } from "./schema.js";

const router = Router();

router.post("/item-suggest", requireAuth, validate(itemSuggestSchema), asyncHandler(suggestItemController));

export default router;

