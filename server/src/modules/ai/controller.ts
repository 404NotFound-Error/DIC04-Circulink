import { Request, Response } from "express";
import { suggestItemByImages } from "./service.js";

export const suggestItemController = async (req: Request, res: Response) => {
  const data = await suggestItemByImages({
    imagePaths: req.body.imagePaths,
    locale: req.body.locale,
    userHint: req.body.userHint
  });
  res.json({ data });
};

