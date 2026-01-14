const { HttpError } = require("../utils/errors");

const notFound = (req, res, next) => {
  const error = new HttpError(404, "NOT_FOUND", "Route not found");
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Unexpected error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code,
      message,
      requestId: req.id || null
    }
  });
};

module.exports = {
  notFound,
  errorHandler
};
