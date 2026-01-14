const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("4000"),
  CORS_ORIGIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().default("60000"),
  RATE_LIMIT_MAX: z.string().default("100"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  BCRYPT_ROUNDS: z.string().default("10")
});

const env = envSchema.parse(process.env);

module.exports = {
  env: {
    nodeEnv: env.NODE_ENV,
    port: Number(env.PORT),
    corsOrigin: env.CORS_ORIGIN,
    rateLimitWindowMs: Number(env.RATE_LIMIT_WINDOW_MS),
    rateLimitMax: Number(env.RATE_LIMIT_MAX),
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtAccessTtl: env.JWT_ACCESS_TTL,
    jwtRefreshTtl: env.JWT_REFRESH_TTL,
    bcryptRounds: Number(env.BCRYPT_ROUNDS)
  }
};
