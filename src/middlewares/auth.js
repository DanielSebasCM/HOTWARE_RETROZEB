const authUtil = require("../utils/auth");
const User = require("../models/user.model");

const authMiddleware = {
  // VALIDATE ACTIVE TOKEN
  validateTokenActive: async (req, res, next) => {
    let token;

    if (req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];
    else token = req.cookies.rzauthToken;

    try {
      const auth = authUtil.verifyToken(token);

      const user = await User.getById(auth.uid);

      if (!user || user.active === 0) return authUtil.deleteSession(req, res);
      
      if (!req.session.currentUser) req.session.currentUser = auth;
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authMiddleware;
