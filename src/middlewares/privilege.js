const User = require("../models/user.model");

const authorize = (privileges, or = false) => {
  return async (req, res, next) => {
    if (!req.session.currentUser) {
      return next();
      // return res.redirect("/login");
    }

    const builtUser = new User(req.session.currentUser);
    let userPrivileges = await builtUser.getPrivileges();
    userPrivileges = userPrivileges.map((privilege) => privilege.name);

    let passes = false;

    console.log(req.originalUrl, privileges);
    if (or) {
      passes = privileges.some((privilege) =>
        userPrivileges.includes(privilege)
      );
    } else {
      passes = privileges.every((privilege) =>
        userPrivileges.includes(privilege)
      );
    }
    console.log(passes);

    if (!passes) {
      res.locals.errorView = true;

      return res.render("errors/404", {
        title: "Retro Zeb - Error 404",
        message: "No encontramos lo que buscabas :(",
      });
    }

    req.app.locals.currentPrivileges = userPrivileges;

    return next();
  };
};

module.exports = authorize;
