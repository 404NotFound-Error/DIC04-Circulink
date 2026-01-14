const express = require("express");
const { z } = require("zod");
const { validateBody } = require("../middleware/validate");
const { createHttpError } = require("../utils/errors");
const {
  createUser,
  findUserByEmail,
  validatePassword,
  storeRefreshToken,
  revokeRefreshToken,
  isRefreshTokenActive
} = require("../services/user-store");
const {
  signAccessToken,
  signRefreshToken,
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
    const refreshToken = signRefreshToken(user);
    storeRefreshToken(refreshToken, { sub: user.id });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken }
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
    const refreshToken = signRefreshToken(user);
    storeRefreshToken(refreshToken, { sub: user.id });

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", validateBody(refreshSchema), (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!isRefreshTokenActive(refreshToken)) {
      throw createHttpError(401, "TOKEN_REVOKED", "Refresh token is revoked");
    }

    const payload = verifyRefreshToken(refreshToken);
    revokeRefreshToken(refreshToken);

    const user = findUserByEmail(payload.email);
    if (!user) {
      throw createHttpError(401, "INVALID_TOKEN", "Refresh token is invalid");
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    storeRefreshToken(newRefreshToken, { sub: user.id });

    res.json({
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", validateBody(refreshSchema), (req, res, next) => {
  try {
    revokeRefreshToken(req.body.refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
