const User = require("../models/user.model");
const { routes } = require("../utils/constants");

const setLocals = async (req, res, next) => {
  try {
    // MESSAGES
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;

    req.session.successMessage = null;
    req.session.errorMessage = null;

    if (!req.session.currentUser) return next();

    if (req.session.currentUser)
      res.locals.currentUser = req.session.currentUser;

    // ROUTES
    res.locals.routes = routes;

    // ACTIVE TEAMS
    const user = await User.getById(req.session.currentUser.uid);
    const teams = await user.getActiveTeams();

    req.session.activeTeams = teams;
    res.locals.activeTeams = teams;

    // SELECTED TEAM
    if (req.body.activeTeam)
      req.session.selectedTeam = teams.find(
        (team) => team.id == req.body.activeTeam
      );

    if (!req.session.selectedTeam) req.session.selectedTeam = teams[0];

    if (!teams || teams.length == 0) {
      req.session.selectedTeam = null;
    }

    res.locals.selectedTeam = req.session.selectedTeam;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { setLocals };
