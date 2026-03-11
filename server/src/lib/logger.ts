import pino from "pino";
const transport: pino.TransportSingleOptions | undefined =
  process.env.NODE_ENV !== "production"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport
});
