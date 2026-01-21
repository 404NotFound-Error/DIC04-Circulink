import { z } from "zod";

export const listMessagesSchema = z.object({
  query: z.object({
    threadId: z.string().optional(),
    itemId: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional()
  }),
  params: z.object({}),
  body: z.object({})
});

export const sendMessageSchema = z.object({
  body: z.object({
    threadId: z.string().optional(),
    itemId: z.string().optional(),
    recipientId: z.string().optional(),
    body: z.string().min(1).max(2000)
  }).superRefine((data, ctx) => {
    if (!data.threadId && !data.itemId) {
      ctx.addIssue({ code: "custom", message: "threadId or itemId is required" });
    }
  }),
  params: z.object({}),
  query: z.object({})
});

export const markReadSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({}),
  query: z.object({})
});
