import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  BCRYPT_ROUNDS: z.string().default("10"),
  CORS_ORIGIN: z.string().optional(),
  UPLOAD_DIR: z.string().default("uploads"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().default("https://api.openai.com/v1"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini")
});

const parsedEnv = envSchema.parse(process.env);
export const env = {
  ...parsedEnv,
  OPENAI_API_KEY: parsedEnv.OPENAI_API_KEY?.trim(),
  OPENAI_BASE_URL: parsedEnv.OPENAI_BASE_URL.trim(),
  OPENAI_MODEL: parsedEnv.OPENAI_MODEL.trim()
};

export const serverConfig = {
  port: parseInt(env.PORT, 10) || 4000,
  corsOrigins: env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? ["*"],
  uploadDir: env.UPLOAD_DIR
};

export const authConfig = {
  accessTtl: env.JWT_ACCESS_TTL,
  refreshTtl: env.JWT_REFRESH_TTL,
  bcryptRounds: parseInt(env.BCRYPT_ROUNDS, 10) || 10
};
