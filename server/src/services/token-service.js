const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessTtl }
  );

const createRefreshToken = (user, options = {}) => {
  const tokenId = crypto.randomUUID();
  const familyId = options.familyId || crypto.randomUUID();

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      jti: tokenId,
      fid: familyId
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshTtl }
  );

  const decoded = jwt.decode(token);
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : null;

  return {
    token,
    tokenId,
    familyId,
    expiresAt
  };
};

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

module.exports = {
  signAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
