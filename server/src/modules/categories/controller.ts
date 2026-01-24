import { Request, Response } from "express";
import { listCategories } from "./service.js";

export const listCategoriesController = async (_req: Request, res: Response) => {
  const categories = await listCategories();
  res.json({ data: categories });
};
