import pino from "pino";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let transport: pino.TransportSingleOptions | undefined;

if (process.env.NODE_ENV !== "production") {
  try {
    require.resolve("pino-pretty");
    transport = { target: "pino-pretty", options: { colorize: true } };
  } catch {
    transport = undefined;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport
});
