const authUtil = require("../utils/auth");

const authMiddleware = {
  // VALIDATE ACTIVE TOKEN
  validateTokenActive: (req, res, next) => {
    if (!req.session.currentUser) return res.redirect("/login");

    let token;

    if (req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];
    else token = req.cookies.rzauthToken;

    try {
      authUtil.verifyToken(token);
      next();
    } catch (error) {
      console.log("error: ", error);
      res.redirect("/login");
    }
  },
};

module.exports = authMiddleware;
