const { createHttpError } = require("../utils/errors");

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    return next(createHttpError(400, "VALIDATION_ERROR", message));
  }

  req.body = result.data;
  return next();
};

module.exports = {
  validateBody
};
