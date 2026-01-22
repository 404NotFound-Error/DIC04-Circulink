const express = require("express");
const { z } = require("zod");
const { validateBody } = require("../middleware/validate");
const { createHttpError } = require("../utils/errors");
const {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword,
  storeRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenFamily,
  getRefreshToken,
  isRefreshTokenActive
} = require("../services/user-store");
const {
  signAccessToken,
  createRefreshToken,
  verifyRefreshToken
} = require("../services/token-service");

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required")
});

router.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const accessToken = signAccessToken(user);
    const refreshToken = createRefreshToken(user);
    storeRefreshToken({
      tokenId: refreshToken.tokenId,
      userId: user.id,
      familyId: refreshToken.familyId,
      expiresAt: refreshToken.expiresAt
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken: refreshToken.token }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const user = findUserByEmail(req.body.email);
    if (!user) {
      throw createHttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const isValid = await validatePassword(user, req.body.password);
    if (!isValid) {
      throw createHttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const accessToken = signAccessToken(user);
    const refreshToken = createRefreshToken(user);
    storeRefreshToken({
      tokenId: refreshToken.tokenId,
      userId: user.id,
      familyId: refreshToken.familyId,
      expiresAt: refreshToken.expiresAt
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken: refreshToken.token }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", validateBody(refreshSchema), (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw createHttpError(401, "INVALID_TOKEN", "Refresh token is invalid");
    }

    const tokenId = payload.jti;
    const familyId = payload.fid;
    if (!tokenId || !familyId) {
      throw createHttpError(401, "INVALID_TOKEN", "Refresh token is invalid");
    }

    const storedToken = getRefreshToken(tokenId);
    if (!storedToken) {
      throw createHttpError(401, "TOKEN_REVOKED", "Refresh token is revoked");
    }

    if (!isRefreshTokenActive(tokenId)) {
      if (storedToken.revokedReason === "ROTATED" && storedToken.replacedByTokenId) {
        revokeRefreshTokenFamily(storedToken.familyId, "REUSE_DETECTED");
        throw createHttpError(401, "TOKEN_REUSE_DETECTED", "Refresh token reuse detected");
      }
      throw createHttpError(401, "TOKEN_REVOKED", "Refresh token is revoked");
    }

    const user = findUserById(payload.sub);
    if (!user) {
      throw createHttpError(401, "INVALID_TOKEN", "Refresh token is invalid");
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = createRefreshToken(user, { familyId });
    revokeRefreshToken(tokenId, "ROTATED", newRefreshToken.tokenId);
    storeRefreshToken({
      tokenId: newRefreshToken.tokenId,
      userId: user.id,
      familyId: newRefreshToken.familyId,
      expiresAt: newRefreshToken.expiresAt
    });

    res.json({
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken.token }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", validateBody(refreshSchema), (req, res, next) => {
  try {
    let payload;
    try {
      payload = verifyRefreshToken(req.body.refreshToken);
    } catch (error) {
      throw createHttpError(401, "INVALID_TOKEN", "Refresh token is invalid");
    }

    if (payload?.jti) {
      revokeRefreshToken(payload.jti, "LOGOUT");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
