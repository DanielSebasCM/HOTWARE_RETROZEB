const Team = require("../models/team.model");
const User = require("../models/user.model");
const sqlErrorCodes = require("../utils/db.errors");
const messages = require("../utils/messages");

const getAllWithUsers = async (req, res) => {
  const teams = await Team.getAllActive();
  for (let team of teams) {
    team.members = await team.getMembers();
  }

  const userTeams = teams.filter((team) =>
    team.members.find(
      (member) =>
        member.uid == req.app.locals.currentUser.uid && member.active == 1
    )
  );

  const availableTeams = teams.filter(
    (team) =>
      !team.members.find(
        (member) =>
          member.uid == req.app.locals.currentUser.uid && member.active == 1
      )
  );

  res
    .status(200)
    .render("teams/index", { title: "Equipos", userTeams, availableTeams });
};

const addUser = async (req, res, next) => {
  try {
    const { id_team, uid } = req.body;

    // Verify that the team exists
    const team = await Team.getById(id_team);

    // Verify that the user exists
    // const user = await User.getById(uid);

    // Verify if user exists in the team
    const members = await team.getMembers();
    const userInTeam = members.find((member) => member.uid == uid);
    if (userInTeam) {
      req.session.errorMessage = messages.team.error.duplicateTeamMember;
      return res
        .status(400)
        .json({ message: messages.team.error.duplicateTeamMember });
    }

    await team.addUser(uid);
    req.session.successMessage = messages.team.success.teamMemberAdded;
    return res
      .status(200)
      .json({ message: messages.team.success.teamMemberAdded });
  } catch (err) {
    next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const { id_team, uid } = req.body;

    // Verify that the team exists
    const team = await Team.getById(id_team);

    // Verify that the user exists
    // const user = await User.getById(uid);

    // Verify if user exists in the team
    const members = await team.getMembers();
    const userInTeam = members.find((member) => member.uid == uid);
    if (!userInTeam) {
      req.session.errorMessage = messages.team.error.teamMemberDoesNotExist;
      return res
        .status(400)
        .json({ message: messages.team.error.teamMemberDoesNotExist });
    }

    await team.removeUser(uid);
    req.session.successMessage = messages.team.success.teamMemberRemoved;
    res.status(200).json({ message: messages.team.success.teamMemberRemoved });
  } catch (err) {
    next(err);
  }
};

// UTILS
const setLocalTeams = async (req, res) => {
  try {
    const user = new User(req.app.locals.currentUser);
    const teams = await user.getActiveTeams();

    req.app.locals.activeTeams = teams;
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
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
  addUser,
  removeUser,
  setLocalTeams,
};

/*

const addUser = async (req, res) => {
  try {
    const { id_team, uid } = req.body;

    // Verify if user is deactivated in the team
    let userAlreayExists = false;
    const userData = await Team.getUserById(id_team, uid);
    
    userData.forEach((user) => {
      if (user.active == 1) userAlreayExists = true;
    });

    if (userAlreayExists) {
      req.session.errorMessage = messages.team.error.duplicateTeamMember;
      return res
        .status(409)
        .json({ message: messages.team.error.duplicateTeamMember });
    }

    // Verify that the user exists
    // User.getById(uid).catch(() => {
    //   return res
    //     .status(404)
    //     .json({ message: messages.team.user.userDoesNotExist });
    // });

    // Verify that the team exists
    Team.getById(id_team)
      .then(async (team) => {
        await team.addUser(uid);
        req.session.successMessage = messages.team.success.teamMemberAdded;

        res
          .status(200)
          .json({ message: messages.team.success.teamMemberAdded });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ message: messages.team.error.teamDoesNotExist });
      });
  } catch (err) {
    console.error(err);

    if (err.code == sqlErrorCodes.duplicateEntry) {
      req.session.errorMessage = messages.team.error.duplicateTeamMember;
      return res
        .status(409)
        .json({ message: messages.team.error.duplicateTeamMember });
    }

    if (
      err.code == sqlErrorCodes.errorConnecting ||
      err.code == sqlErrorCodes.unknownDB ||
      !err.code
    )
      return res.status(500).render("errors/500");

    return res.status(500).render("errors/500");
  }
};
*/
