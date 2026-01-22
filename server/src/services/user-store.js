const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { env } = require("../config/env");
const { createHttpError } = require("../utils/errors");

const usersByEmail = new Map();
const usersById = new Map();
const refreshTokens = new Map();
const refreshTokenFamilies = new Map();

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
const findUserById = (id) => usersById.get(id);

const validatePassword = async (user, password) =>
  bcrypt.compare(password, user.passwordHash);

const storeRefreshToken = ({ tokenId, userId, familyId, expiresAt }) => {
  refreshTokens.set(tokenId, {
    tokenId,
    userId,
    familyId,
    issuedAt: Date.now(),
    expiresAt,
    revokedAt: null,
    revokedReason: null,
    replacedByTokenId: null
  });

  if (!refreshTokenFamilies.has(familyId)) {
    refreshTokenFamilies.set(familyId, new Set());
  }
  refreshTokenFamilies.get(familyId).add(tokenId);
};

const getRefreshToken = (tokenId) => refreshTokens.get(tokenId);

const revokeRefreshToken = (tokenId, reason = "REVOKED", replacedByTokenId = null) => {
  const token = refreshTokens.get(tokenId);
  if (!token || token.revokedAt) {
    return;
  }

  token.revokedAt = Date.now();
  token.revokedReason = reason;
  token.replacedByTokenId = replacedByTokenId;
};

const revokeRefreshTokenFamily = (familyId, reason = "REUSE_DETECTED") => {
  const family = refreshTokenFamilies.get(familyId);
  if (!family) {
    return;
  }

  for (const tokenId of family) {
    revokeRefreshToken(tokenId, reason);
  }
};

const isRefreshTokenActive = (tokenId) => {
  const token = refreshTokens.get(tokenId);
  if (!token) {
    return false;
  }
  if (token.revokedAt) {
    return false;
  }
  if (token.expiresAt && token.expiresAt <= Date.now()) {
    return false;
  }
  return true;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword,
  storeRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenFamily,
  isRefreshTokenActive
};
