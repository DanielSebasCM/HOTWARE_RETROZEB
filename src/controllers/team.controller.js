const Team = require("../models/team.model");
const sqlErrorCodes = require("../utils/db.errors");
const messages = require("../utils/messages");

const getAllWithUsers = async (req, res) => {
  try {
    const teams = await Team.getAllWithUsers(req.app.locals.currentUser.id);
    res.status(200).render("teams/index", { title: "Equipos", teams });
  } catch (err) {
    console.error(err.message);
    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("errors/500");

    return res.status(500).render("errors/500");
  }
};

const addUserToTeam = async (req, res) => {
  try {
    const { id_team, uid } = req.body;

    // Verify if user is deactivated in the team
    let userAlreayExists = false;
    const userData = await Team.getUserById(id_team, uid);
    userData.forEach((user) => {
      if (user.active == 1) userAlreayExists = true;
    });

    if (userAlreayExists)
      return res
        .status(409)
        .json({ message: messages.team.error.duplicateTeamMember });

    // Verify that the team exists
    Team.getById(id_team).catch(() => {
      return res
        .status(404)
        .json({ message: messages.team.error.teamDoesNotExist });
    });

    // Verify that the user exists
    // User.getById(uid).catch(() => {
    //   return res
    //     .status(404)
    //     .json({ message: messages.team.user.userDoesNotExist });
    // });

    await Team.addUserToTeam(id_team, uid);

    res.status(200).json({ message: messages.team.success.teamMemberAdded });
  } catch (err) {
    console.error(err);
    if (err.code == sqlErrorCodes.duplicateEntry)
      return res
        .status(409)
        .json({ message: messages.team.error.duplicateTeamMember });

    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("errors/500");

    return res.status(500).render("errors/500");
  }
};

const removeUserFromTeam = async (req, res) => {
  try {
    const { id_team, uid } = req.body;

    // Verify if user exists in the team
    let userInTeam = false;
    const userData = await Team.getUserById(id_team, uid);
    userData.forEach((user) => {
      if (user.active == 1) userInTeam = true;
    });

    if (!userData || !userInTeam) {
      return res
        .status(404)
        .json({ message: messages.team.error.teamMemberDoesNotExist });
    }

    // Verify that the team exists
    Team.getById(id_team).catch(() => {
      return res

        .status(404)
        .json({ message: messages.team.error.teamDoesNotExist });
    });

    // Verify that the user exists
    // User.getById(uid).catch(() => {
    //   return res
    //     .status(404)
    //     .json({ message: messages.team.user.userDoesNotExist });
    // });

    await Team.removeUserFromTeam(id_team, uid);
    res.status(200).json({ message: messages.team.success.teamMemberRemoved });
  } catch (err) {
    console.error(err);
    if (err.code == sqlErrorCodes.duplicateEntry)
      return res
        .status(409)
        .json({ message: messages.team.error.duplicateTeamMember });

    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("errors/500");

    return res.status(500).render("errors/500");
  }
};

// UTILS
const setLocalTeams = async (req, res, next) => {
  try {
    req.app.locals.currentUser = {
      first_name: "Mariane",
      last_name: "Boyer",
      id: 12,
    };
    const teams = await Team.getAllActiveByUser(req.app.locals.currentUser.id);
    req.app.locals.activeTeams = teams;
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
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

module.exports = {
  getAllWithUsers,
  addUserToTeam,
  removeUserFromTeam,
  setLocalTeams,
};
