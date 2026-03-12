import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { rateLimit } from "../../middleware/rate-limit.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { listMessagesSchema, markReadSchema, sendMessageSchema } from "./schema.js";
import { listMessagesController, markReadController, sendMessageController } from "./controller.js";

const router = Router();
const messagesReadRateLimit = rateLimit({ scope: "messages-read", windowMs: 60_000, max: 120 });
const messagesWriteRateLimit = rateLimit({ scope: "messages-write", windowMs: 60_000, max: 40 });

router.get("/", requireAuth, messagesReadRateLimit, validate(listMessagesSchema), asyncHandler(listMessagesController));

router.post("/", requireAuth, messagesWriteRateLimit, validate(sendMessageSchema), asyncHandler(sendMessageController));

router.patch("/:id/read", requireAuth, messagesWriteRateLimit, validate(markReadSchema), asyncHandler(markReadController));

export default router;
