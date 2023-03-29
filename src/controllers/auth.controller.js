const authUtil = require("../utils/auth");
const User = require("../models/user.model");
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
    const { token } = req.body;

    // VALIDATE TOKEN
    const data = await verifyGoogleToken(token);

    // VERIFY IF USER EXISTS ALREADY IN DB
    // IF EXISTS, GET USER

    let user;
    try {
      user = await User.getByEmail(data.email);
    } catch (err) {
      if (!user) {
        // GET ID JIRA

        // IF NOT, CREATE USER
        const newUser = new User({
          id_google_auth: data.sub,
          email: data.email,
          first_name: data.given_name,
          last_name: data.family_name,
        });

        const result = await newUser.post();
        user = await User.getById(result.insertId);
      }
    }

    const userData = {
      uid: user.uid,
      id_google_auth: data.sub,
      id_jira: user.id_jira,
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
      picture: data.picture,
    };

    // SAVE IN SESSION
    req.session.currentUser = userData;

    // CREATE TOKENS
    const authToken = authUtil.createTokenLogin(userData);
    const refreshToken = authUtil.createRefreshToken(userData);

    res.status(200).json({ authToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// @zeb.mx
// @luuna.mx
// @nooz.mx
// @mappa.mx

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
