import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AuthError, ConflictError, NotFoundError } from "../../utils/errors.js";
import { authConfig, env } from "../../config/env.js";

const parseDurationMs = (value: string) => {
  const match = value.trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();
  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return amount;
  }
};

const issueAccessToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: authConfig.accessTtl }
  );
};

const issueRefreshToken = (userId: string) => {
  const jti = crypto.randomUUID();
  return jwt.sign({ sub: userId, typ: "refresh", jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: authConfig.refreshTtl
  });
};

const createRefreshTokenRecord = async (userId: string) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const refreshToken = issueRefreshToken(userId);
    try {
      await prisma.refreshToken.create({
        data: {
          userId,
          token: refreshToken,
          expiresAt: refreshExpiresAt()
        }
      });
      return refreshToken;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        continue;
      }
      throw error;
    }
  }
  throw new AuthError("Failed to issue refresh token");
};

const refreshExpiresAt = () => {
  const ttlMs = parseDurationMs(authConfig.refreshTtl);
  return new Date(Date.now() + (ttlMs || 7 * 24 * 60 * 60 * 1000));
};

export const registerUser = async (payload: { email: string; password: string; name?: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new ConflictError("Email already in use");

  const passwordHash = await bcrypt.hash(payload.password, authConfig.bcryptRounds);
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      passwordHash,
      name: payload.name ?? null,
      profile: {
        create: {
          displayName: payload.name ?? payload.email
        }
      }
    }
  });

  const accessToken = issueAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = await createRefreshTokenRecord(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerifiedAt: user.emailVerifiedAt },
    tokens: { accessToken, refreshToken }
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AuthError("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AuthError("Invalid email or password");

  const accessToken = issueAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = await createRefreshTokenRecord(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerifiedAt: user.emailVerifiedAt },
    tokens: { accessToken, refreshToken }
  };
};

export const refreshSession = async (token: string) => {
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    throw new AuthError("Invalid refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revokedAt) throw new AuthError("Refresh token revoked");
  if (stored.expiresAt <= new Date()) throw new AuthError("Refresh token expired");

  const userId = payload.sub as string | undefined;
  if (!userId) throw new AuthError("Invalid refresh token");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("Invalid refresh token");

  await prisma.refreshToken.update({
    where: { token },
    data: { revokedAt: new Date() }
  });

  const accessToken = issueAccessToken({ id: user.id, email: user.email, role: user.role });
  const newRefreshToken = await createRefreshTokenRecord(user.id);

  return { tokens: { accessToken, refreshToken: newRefreshToken } };
};

export const logoutSession = async (token: string) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() }
  });
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true }
  });
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const requestEmailVerification = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new NotFoundError("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: { userId: user.id, token, expiresAt }
  });

  return { token, expiresAt };
};

export const verifyEmailToken = async (token: string) => {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.usedAt) throw new AuthError("Invalid or used token");
  if (record.expiresAt <= new Date()) throw new AuthError("Token expired");

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { token },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() }
    })
  ]);
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new NotFoundError("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt }
  });

  return { token, expiresAt };
};

export const resetPassword = async (token: string, password: string) => {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.usedAt) throw new AuthError("Invalid or used token");
  if (record.expiresAt <= new Date()) throw new AuthError("Token expired");

  const passwordHash = await bcrypt.hash(password, authConfig.bcryptRounds);

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    })
  ]);
};

export const updateUserProfile = async (
  userId: string,
  data: { name?: string; phone?: string; university?: string; avatarUrl?: string }
) => {
  const updateData: Prisma.UserUpdateInput = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.university !== undefined) updateData.university = data.university;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      university: true,
      avatarUrl: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};
