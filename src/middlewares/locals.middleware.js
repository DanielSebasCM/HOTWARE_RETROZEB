const User = require("../models/user.model");
const { routes } = require("../utils/constants");

const setLocals = async (req, res, next) => {
  try {
    // USER
    req.app.locals.currentUser = {
      first_name: "Mariane",
      last_name: "Boyer",
      uid: 12,
      email: "mariane@boyer.com",
    };

    if (req.session.currentUser)
      req.app.locals.currentUser = req.session.currentUser;

    // MESSAGES
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;

    if (res.locals.successMessage) {
      setTimeout(() => {
        res.locals.successMessage = null;
      }, 5000);
    }

    if (res.locals.errorMessage) {
      setTimeout(() => {
        res.locals.errorMessage = null;
      }, 5000);
    }

    // ROUTES
    res.locals.routes = routes;

    // ACTIVE TEAMS
    const user = new User(req.app.locals.currentUser);
    const teams = await user.getActiveTeams();

    req.app.locals.activeTeams = teams;

    // SELECTED TEAM
    if (req.body.activeTeam)
      req.app.locals.selectedTeam = teams.find(
        (team) => team.id == req.body.activeTeam
      );
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
    if (!teams || teams.length == 0) {
      req.app.locals.selectedTeam = null;
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { setLocals };
