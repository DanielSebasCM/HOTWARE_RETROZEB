const authUtil = require("../utils/auth");

const authMiddleware = {
  // VALIDATE ACTIVE TOKEN
  validateTokenActive: async (req, res, next) => {
    let token;

    if (req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];
    else token = req.cookies.rzauthToken;

    try {
      const auth = authUtil.verifyToken(token);
      if (!req.session.currentUser) req.session.currentUser = auth;

      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authMiddleware;
