const { verifyAccessToken } = require("../services/token-service");
const { createHttpError } = require("../utils/errors");

const requireAuth = (req, res, next) => {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return next(createHttpError(401, "UNAUTHORIZED", "Missing access token"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(createHttpError(401, "UNAUTHORIZED", "Invalid access token"));
  }
};

module.exports = {
  requireAuth
};
