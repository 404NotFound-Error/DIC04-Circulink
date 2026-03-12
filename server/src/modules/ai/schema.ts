import { z } from "zod";

export const itemSuggestSchema = z.object({
  body: z.object({
    imagePaths: z.array(z.string().min(1)).min(1).max(6),
    userHint: z.string().max(500).optional(),
    locale: z.enum(["zh", "en"]).optional()
  }),
  query: z.object({}),
  params: z.object({})
});

