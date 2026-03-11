import { Request, Response } from "express";
import { listMessages, listThreads, markMessageRead, sendMessage } from "./service.js";

export const listMessagesController = async (req: Request, res: Response) => {
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
};

export const sendMessageController = async (req: Request, res: Response) => {
  const message = await sendMessage(req.user!.id, req.body);
  res.status(201).json({ data: message });
};

export const markReadController = async (req: Request, res: Response) => {
  const message = await markMessageRead(req.user!.id, String(req.params.id));
  res.json({ data: message });
};
