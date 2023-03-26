const teamController = require("../controllers/team.controller");

const setLocals = async (req, res, next) => {
  console.log("middleware");
  try {
    req.app.locals.currentUser = {
      first_name: "Mariane",
      last_name: "Boyer",
      id: 12,
    };
    console.log(req.session.successMessage);
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;

    await teamController.setLocalTeams(req, res, next);
    next();
  } catch (err) {
    console.log(err);
    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("errors/500");

    return res.status(500).render("errors/500");
  }
};

module.exports = setLocals;
