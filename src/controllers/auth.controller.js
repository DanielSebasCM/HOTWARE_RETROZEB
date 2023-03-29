const authUtil = require("../utils/auth");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const renderLogin = (req, res) => {
  // LOCALS
  req.app.locals.teams = [];
  req.app.locals.currentUser = null;

  // SESSION
  req.session.successMessage = "";
  req.session.errorMessage = "";

  res.render("index", { title: "Login" });
};

const loginAPI = async (req, res, next) => {
  try {
    const { token, id_google_auth, email, first_name, last_name, picture } =
      req.body;

    const userData = {
      id_google_auth,
      email,
      first_name,
      last_name,
      picture,
    };

    // VALIDATE TOKEN
    await verifyGoogleToken(token);

    // VERIFY IF USER EXISTS ALREADY IN DB
    // IF EXISTS, GET USER

    // IF NOT, CREATE USER

    // CREATE TOKENS
    const authToken = authUtil.createTokenLogin(userData);
    const refreshToken = authUtil.createRefreshToken(userData);

    res.status(200).json({ authToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// UTILS
async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

module.exports = {
  renderLogin,
  loginAPI,
};
