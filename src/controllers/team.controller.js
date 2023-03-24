const Team = require("../models/team.model");
const sqlErrorCodes = require("../utils/db.errors");
const messages = require("../utils/messages");

const getAllWithUsers = async (_, res) => {
  try {
    const teams = await Team.getAllWithUsers();
    res
      .status(200)
      .render("teams/index", { title: "Equipos", teams, user: "Hotware" });
  } catch (err) {
    console.error(err.message);
    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("500/index");

    return res.status(500).render("500/index");
  }
};

const addUserToTeam = async (req, res) => {
  try {
    const { id_team, uid } = req.body;

    // Verify if user is deactivated in the team
    const userData = await Team.getUserById(id_team, uid);
    if (userData && userData.active == 0) {
      console.log("Activating user in team");
      await Team.activateUserInTeam(id_team, uid);
      return res
        .status(200)
        .json({ message: messages.team.success.teamMemberAdded });
      return;
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

    const data = await Team.addUserToTeam(id_team, uid);

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
      return res.status(500).render("500/index");

    return res.status(500).render("500/index");
  }
};

const removeUserFromTeam = async (req, res) => {
  try {
    const { id_team, uid } = req.body;

    // Verify if user exists in the team
    const userData = await Team.getUserById(id_team, uid);
    if (!userData || userData.active == 0) {
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
      return res.status(500).render("500/index");

    return res.status(500).render("500/index");
  }
};

// UTILS
const setLocalTeams = async (req, res, next) => {
  try {
    const teams = await Team.getAllActive();
    req.app.locals.activeTeams = teams;
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
    if (next) next();
    return teams;
  } catch (err) {
    console.log(err.message);
    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("500/index");

    return res.status(500).render("500/index");
  }
};

module.exports = {
  getAllWithUsers,
  addUserToTeam,
  removeUserFromTeam,
  setLocalTeams,
};
