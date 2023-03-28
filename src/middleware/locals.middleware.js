const User = require("../models/user.model");

const setLocals = async (req, res, next) => {
  try {
    // USER
    req.app.locals.currentUser = {
      first_name: "Mariane",
      last_name: "Boyer",
      uid: 12,
      email: "mariane@boyer.com",
    };

    // MESSAGES
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;

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

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { setLocals };
