import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { listMessagesSchema, markReadSchema, sendMessageSchema } from "./schema.js";
import { listMessages, listThreads, markMessageRead, sendMessage } from "./service.js";

const router = Router();

router.get("/", requireAuth, validate(listMessagesSchema), asyncHandler(async (req, res) => {
  const threadId = req.query.threadId as string | undefined;
  const itemId = req.query.itemId as string | undefined;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

  if (threadId) {
    const result = await listMessages(req.user!.id, threadId, page, pageSize);
    return res.json({ data: result.messages, meta: { page: result.page, pageSize: result.pageSize, total: result.total } });
  }

  const result = await listThreads(req.user!.id, itemId, page, pageSize);
  return res.json({ data: result.threads, meta: { page: result.page, pageSize: result.pageSize, total: result.total } });
}));

router.post("/", requireAuth, validate(sendMessageSchema), asyncHandler(async (req, res) => {
  const message = await sendMessage(req.user!.id, req.body);
  res.status(201).json({ data: message });
}));

router.patch("/:id/read", requireAuth, validate(markReadSchema), asyncHandler(async (req, res) => {
  const message = await markMessageRead(req.user!.id, req.params.id);
  res.json({ data: message });
}));

export default router;
