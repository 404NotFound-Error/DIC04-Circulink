import { Request, Response } from "express";
import { addFavorite, listFavorites, removeFavorite } from "./service.js";

export const listFavoritesController = async (req: Request, res: Response) => {
  const { favorites, total, page, pageSize } = await listFavorites(
    req.user!.id,
    req.query.page ? Number(req.query.page) : undefined,
    req.query.pageSize ? Number(req.query.pageSize) : undefined
  );
  res.json({ data: favorites, meta: { page, pageSize, total } });
};

export const addFavoriteController = async (req: Request, res: Response) => {
  const favorite = await addFavorite(req.user!.id, req.body.itemId);
  res.status(201).json({ data: favorite });
};

export const removeFavoriteController = async (req: Request, res: Response) => {
  await removeFavorite(req.user!.id, req.params.id);
  res.status(204).send();
};
