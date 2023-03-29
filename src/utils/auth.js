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

  let decodedInfo;

  jwt.verify(token, typeToken, (error, decoded) => {
    if (error) throw new jwt.TokenExpiredError(error);
    decodedInfo = decoded;
  });

  return decodedInfo;
};

module.exports = {
  createTokenLogin,
  createRefreshToken,
  verifyToken,
};
