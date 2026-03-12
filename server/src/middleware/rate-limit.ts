import { RequestHandler } from "express";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  scope: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const getClientKey = (req: Parameters<RequestHandler>[0]) => {
  if (req.user?.id) return `user:${req.user.id}`;
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded || req.ip || "unknown");
  const ip = String(rawIp).split(",")[0].trim();
  return `ip:${ip || "unknown"}`;
};

const nowMs = () => Date.now();

export const rateLimit = (options: RateLimitOptions): RequestHandler => {
  const { windowMs, max, scope } = options;

  return (req, res, next) => {
    const now = nowMs();
    const key = `${scope}:${getClientKey(req)}`;
    const current = buckets.get(key);

    if (!current || now > current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests",
          requestId: req.requestId
        }
      });
    }

    current.count += 1;
    buckets.set(key, current);
    return next();
  };
};
