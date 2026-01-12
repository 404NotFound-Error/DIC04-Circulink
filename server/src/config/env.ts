import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  CORS_ORIGIN: z.string().optional(),
  UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);

export const serverConfig = {
  port: parseInt(env.PORT, 10) || 4000,
  corsOrigins: env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? ["*"],
  uploadDir: env.UPLOAD_DIR
};
