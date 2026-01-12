import express from "express";
import cors from "cors";
import path from "path";
import { authenticate } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { router } from "./routes/index.js";
import { serverConfig } from "./config/env.js";

export const createApp = () => {
  const app = express();
  app.use(cors({ origin: serverConfig.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(authenticate);
  app.use("/uploads", express.static(path.resolve(serverConfig.uploadDir)));
  app.use("/api", router);
  app.use((req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });
  app.use(errorHandler);
  return app;
};
