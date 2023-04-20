const authUtil = require("../utils/auth");
const User = require("../models/user.model");

const renderLogin = (req, res) => {
  if (req.session.currentUser) return res.redirect("/");

  // LOCALS
  res.locals.activeTeams = [];
  res.locals.currentUser = null;
  res.locals.currentTeam = null;

  // SESSION
  req.session.currentUser = null;
  req.session.currentTeam = null;
  req.session.activeTeams = [];

  res.render("index", { title: "Login" });
};

const loginAPI = async (req, res, next) => {
  // @zeb.mx, @luuna.mx, @nooz.mx, @mappa.mx
  try {
    const { token } = req.body;

    // VALIDATE TOKEN
    const data = await authUtil.verifyGoogleToken(token);

    let user = null;
    let uid = null;
    let id_jira = null;

    // VERIFY IF USER EXISTS ALREADY IN DB
    try {
      user = await User.getByEmail(data.email);
    } catch {
      return res
        .status(500)
        .json({
          message:
            "Ocurrió un error con el servidor. Por favor intenta más tarde.",
        });
    }

    if (user && user.active === 0)
      return res
        .status(401)
        .json({
          message:
            "Tu usuario está inactivo. Por favor pide a un administrador que active tu cuenta.",
        });

    if (!user) {
      // GET ID JIRA
      id_jira = Math.random().toString(36);

      // CREATE USER
      const newUser = new User({
        id_google_auth: data.sub,
        id_jira: id_jira,
        email: data.email,
        first_name: data.given_name,
        last_name: data.family_name,
        picture: data.picture,
        active: 0,
      });

      const result = await newUser.post();
      uid = newUser.uid = result.insertId;

      // ADD USER ROLE
      await newUser.addRole({ id: 2 });

      return res
        .status(401)
        .json({
          message:
            "Tu usuario está inactivo. Por favor pide a un administrador que active tu cuenta.",
        });
    }

    const userData = {
      uid: uid || user.uid,
      id_google_auth: data.sub,
      id_jira: id_jira || user.id_jira,
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
      picture: data.picture,
      active: 1,
    };

    // SAVE IN SESSION
    req.session.currentUser = userData;

    // CREATE TOKENS
    const authToken = authUtil.createTokenLogin(userData);
    const refreshToken = authUtil.createRefreshToken(userData);

    res.status(200).json({ authToken, refreshToken });
  } catch (error) {
    const errorMessage = error.message.split(" ");
    errorMessage.pop();

    if (errorMessage.join(" ") === "Invalid token signature:") {
      req.session.errorMessage = "Acceso denegado";
      return res.status(401).json({ message: "Acceso denegado" });
    }

    next(error);
  }
};

const logoutAPI = (req, res) => {
  authUtil.deleteSession(req, res);
};

const refreshTokenAPI = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // VERIFY REFRESH TOKEN
    const verified = authUtil.verifyToken(refreshToken, "refresh");

    let user;
    // VERIFY IF USER EXISTS ALREADY IN DB
    try {
      user = await User.getByEmail(verified.email);
    } catch {
      return res
        .status(500)
        .json({
          message:
            "Ocurrió un error con el servidor. Por favor intenta más tarde.",
        });
    }

    if (!user || user.active === 0)
      return res
        .status(401)
        .json({
          message:
            "Tu usuario está inactivo. Por favor pide a un administrador que active tu cuenta.",
        });

    const userData = {
      uid: verified.uid,
      id_google_auth: verified.id_google_auth,
      id_jira: verified.id_jira,
      email: verified.email,
      first_name: verified.first_name,
      last_name: verified.last_name,
      picture: verified.picture,
      active: 1,
    };

    // BLACKLIST REFRESH TOKEN
    const isBlacklisted = await authUtil.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      req.session.errorMessage = "Token invalido. Por favor inicia sesión";
      return authUtil.deleteSession(req, res);
    }

    await authUtil.blacklistToken(refreshToken);

    // CREATE TOKENS
    const authToken = authUtil.createTokenLogin(userData);
    const newRefreshToken = authUtil.createRefreshToken(userData);

    res.status(200).json({ authToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.log("error: ", error);
    authUtil.deleteSession(req, res);
  }
};

module.exports = {
  renderLogin,
  loginAPI,
  logoutAPI,
  refreshTokenAPI,
};
