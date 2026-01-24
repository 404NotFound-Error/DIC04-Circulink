import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { listMessagesSchema, markReadSchema, sendMessageSchema } from "./schema.js";
import { listMessagesController, markReadController, sendMessageController } from "./controller.js";

const router = Router();

router.get("/", requireAuth, validate(listMessagesSchema), asyncHandler(listMessagesController));

router.post("/", requireAuth, validate(sendMessageSchema), asyncHandler(sendMessageController));

router.patch("/:id/read", requireAuth, validate(markReadSchema), asyncHandler(markReadController));

export default router;
