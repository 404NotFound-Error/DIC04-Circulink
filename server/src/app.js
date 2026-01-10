const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { requestId } = require("./middleware/request-id");
const { errorHandler, notFound } = require("./middleware/error-handler");
const authRoutes = require("./routes/auth");

const app = express();

morgan.token("id", (req) => req.id);

app.use(requestId);
app.use(express.json());
app.use(
  cors({
    origin: env.corsOrigin ? env.corsOrigin.split(",") : true,
    credentials: true
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :id"));

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
