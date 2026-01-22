import { z } from "zod";

export const listFavoritesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional()
  }),
  params: z.object({}),
  body: z.object({})
});

export const createFavoriteSchema = z.object({
  body: z.object({ itemId: z.string() }),
  params: z.object({}),
  query: z.object({})
});

export const deleteFavoriteSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({}),
  query: z.object({})
});
