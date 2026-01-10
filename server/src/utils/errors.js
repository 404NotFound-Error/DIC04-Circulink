class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const createHttpError = (status, code, message) => new HttpError(status, code, message);

module.exports = {
  HttpError,
  createHttpError
};
