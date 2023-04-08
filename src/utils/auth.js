const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

const isBlacklisted = async (token) => {
  const tokenExixsts = await Token.getById(token);
  if (tokenExixsts) return true;
  return false;
};

const blacklistToken = async (token) => {
  const tokenModel = new Token({ id: token });
  await tokenModel.post();
};

const deleteSession = (req, res) => {
  // LOCALS
  res.locals.activeTeams = [];
  res.locals.currentUser = null;
  res.locals.currentTeam = null;

  // SESSION
  req.session.destroy();

  // COOKIES
  res.clearCookie(this.cookie, { path: "/" });

  // REDIRECT
  res.status(301).redirect(`/login?error=1`);
};

module.exports = {
  createTokenLogin,
  createRefreshToken,
  verifyToken,
  verifyGoogleToken,
  isBlacklisted,
  blacklistToken,
  deleteSession,
};
