import { Router } from "express";
import categoriesRouter from "../modules/categories/routes.js";
import itemsRouter from "../modules/items/routes.js";
import favoritesRouter from "../modules/favorites/routes.js";
import messagesRouter from "../modules/messages/routes.js";
import ordersRouter from "../modules/orders/routes.js";
import uploadsRouter from "../modules/uploads/routes.js";

export const router = Router();

router.use("/categories", categoriesRouter);
router.use("/items", itemsRouter);
router.use("/favorites", favoritesRouter);
router.use("/messages", messagesRouter);
router.use("/orders", ordersRouter);
router.use("/uploads", uploadsRouter);
