const User = require("../models/user.model");

const authorize = (privileges) => {
  return async (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/login");
    }

    const builtUser = new User(req.session.currentUser);
    let userPrivileges = await builtUser.getPrivileges();
    userPrivileges = userPrivileges.map((privilege) => privilege.name);

    for (privilege of privileges) {
      if (!userPrivileges.includes(privilege)) {
        return res.render("errors/404", {
          title: "Retro Zeb - Error 404",
          message: "No encontramos lo que buscabas :(",
        });
      }
    }

    req.app.locals.currentPrivileges = userPrivileges;

    return next();
  };
};

module.exports = authorize;
