const jwt = require("jsonwebtoken");

const createTokenLogin = (data) => {
  return jwt.sign(data, process.env.JWT_LOGIN, { expiresIn: "1800s" });
};

const createRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH, { expiresIn: "86400s" });
};

const verifyToken = (token, type = "login") => {
  let typeToken;
  if (type === "login") typeToken = process.env.JWT_LOGIN;
  if (type === "refreshToken") typeToken = process.env.JWT_REFRESH;

  return jwt.verify(token, typeToken);
};

module.exports = {
  createTokenLogin,
  createRefreshToken,
  verifyToken,
};
