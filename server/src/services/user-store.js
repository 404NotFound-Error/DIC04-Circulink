const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { env } = require("../config/env");
const { createHttpError } = require("../utils/errors");

const usersByEmail = new Map();
const usersById = new Map();
const refreshTokens = new Map();

const createUser = async ({ email, password, name }) => {
  if (usersByEmail.has(email)) {
    throw createHttpError(409, "USER_EXISTS", "Email already registered");
  }

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  const user = {
    id,
    email,
    name: name || null,
    passwordHash,
    role: "user"
  };

  usersByEmail.set(email, user);
  usersById.set(id, user);

  return user;
};

const findUserByEmail = (email) => usersByEmail.get(email);

const validatePassword = async (user, password) =>
  bcrypt.compare(password, user.passwordHash);

const storeRefreshToken = (token, payload) => {
  refreshTokens.set(token, {
    userId: payload.sub,
    issuedAt: Date.now()
  });
};

const revokeRefreshToken = (token) => {
  refreshTokens.delete(token);
};

const isRefreshTokenActive = (token) => refreshTokens.has(token);

module.exports = {
  createUser,
  findUserByEmail,
  validatePassword,
  storeRefreshToken,
  revokeRefreshToken,
  isRefreshTokenActive
};
