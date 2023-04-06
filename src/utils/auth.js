const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

const createTokenLogin = (data) => {
  return jwt.sign(data, process.env.JWT_LOGIN, { expiresIn: "300s" }); // 5 minutes
};

const createRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH, { expiresIn: "86400s" }); // 24 hours
};

const verifyToken = (token, type = "login") => {
  let typeToken;
  if (type === "login") typeToken = process.env.JWT_LOGIN;
  if (type === "refresh") typeToken = process.env.JWT_REFRESH;

  return jwt.verify(token, typeToken);
};

const isBlacklisted = async (token) => {
  const tokenExixsts = await Token.getById(token);
  if (tokenExixsts) return true;
  return false;
};

const blacklistToken = async (token) => {
  const tokenModel = new Token({ id: token });
  await tokenModel.post();
};

module.exports = {
  createTokenLogin,
  createRefreshToken,
  verifyToken,
  isBlacklisted,
  blacklistToken,
};
