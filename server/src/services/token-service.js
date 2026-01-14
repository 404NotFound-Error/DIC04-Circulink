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

const signRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshTtl }
  );

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
