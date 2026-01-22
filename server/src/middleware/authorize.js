const { createHttpError } = require("../utils/errors");

const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return next(createHttpError(401, "UNAUTHORIZED", "Missing access token"));
  }

  if (!roles.includes(req.user.role)) {
    return next(createHttpError(403, "FORBIDDEN", "Insufficient permissions"));
  }

  return next();
};

const requireOwnership = (getOwnerId, options = {}) => async (req, res, next) => {
  if (!req.user) {
    return next(createHttpError(401, "UNAUTHORIZED", "Missing access token"));
  }

  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      throw createHttpError(404, "RESOURCE_NOT_FOUND", "Resource not found");
    }

    const allowedRoles = options.allowRoles || [];
    if (req.user.sub === ownerId || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(createHttpError(403, "FORBIDDEN", "Insufficient permissions"));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireRole,
  requireOwnership
};
