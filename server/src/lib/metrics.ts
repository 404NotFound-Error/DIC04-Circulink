import { Request, Response } from "express";
import { logger } from "./logger.js";

type RouteKey = string;

type RouteStats = {
  count: number;
  totalMs: number;
  maxMs: number;
};

const metrics = {
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  totalMs: 0,
  maxMs: 0,
  routes: new Map<RouteKey, RouteStats>()
};

const getRouteKey = (req: Request) => {
  const routePath = req.route?.path ? String(req.route.path) : req.path;
  const base = req.baseUrl || "";
  return `${req.method} ${base}${routePath}`;
};

export const metricsMiddleware = (req: Request, res: Response, next: () => void) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const diffNs = process.hrtime.bigint() - start;
    const durationMs = Number(diffNs) / 1e6;
    const key = getRouteKey(req);

    metrics.totalRequests += 1;
    metrics.totalMs += durationMs;
    metrics.maxMs = Math.max(metrics.maxMs, durationMs);

    const route = metrics.routes.get(key) ?? { count: 0, totalMs: 0, maxMs: 0 };
    route.count += 1;
    route.totalMs += durationMs;
    route.maxMs = Math.max(route.maxMs, durationMs);
    metrics.routes.set(key, route);

    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs)
      },
      "request"
    );
  });

  next();
};

export const getMetricsSnapshot = () => {
  const averageMs = metrics.totalRequests ? metrics.totalMs / metrics.totalRequests : 0;
  const routes = Array.from(metrics.routes.entries()).map(([route, stats]) => ({
    route,
    count: stats.count,
    averageMs: stats.count ? stats.totalMs / stats.count : 0,
    maxMs: stats.maxMs
  }));

  return {
    startedAt: metrics.startedAt,
    totalRequests: metrics.totalRequests,
    averageMs,
    maxMs: metrics.maxMs,
    routes
  };
};
