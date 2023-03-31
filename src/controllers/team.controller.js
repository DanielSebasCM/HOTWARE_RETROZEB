const Team = require("../models/team.model");
const messages = require("../utils/messages");

const renderTeams = async (req, res) => {
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

    if (userInTeam)
      throw new Error(messages.team.error.teamMemberAlreadyExists);

    await team.addUser(uid);
    req.session.successMessage = messages.team.success.teamMemberAdded;
    return res.status(200).redirect("/equipos");
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

    if (!userInTeam)
      throw new Error(messages.team.error.teamMemberDoesNotExist);

    await team.removeUser(uid);
    req.session.successMessage = messages.team.success.teamMemberRemoved;
    res.status(200).redirect("/equipos");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderTeams,
  addUser,
  removeUser,
};
