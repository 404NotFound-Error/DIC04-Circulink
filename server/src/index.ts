import { createServer } from "http";
import { createApp } from "./app.ts";
import { logger } from "./lib/logger.js";
import { serverConfig } from "./config/env.js";

const app = createApp();
const server = createServer(app);

server.listen(serverConfig.port, () => {
  logger.info({ port: serverConfig.port }, "Server running");
});
