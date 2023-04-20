const Team = require("../models/team.model");
const User = require("../models/user.model");
const messages = require("../utils/messages");

const renderTeams = async (req, res, next) => {
  try {
    const teams = await Team.getAllActive();
    for (let team of teams) {
      team.members = await team.getMembers();
    }
    // Sort team members by alphabetical order
    teams.forEach((team) => {
      team.members.sort((a, b) => {
        if (a.first_name < b.first_name) {
          return -1;
        }
        if (a.first_name > b.first_name) {
          return 1;
        }
        return 0;
      });
    });

    const userTeams = teams.filter((team) =>
      team.members.find(
        (member) =>
          member.uid == req.session.currentUser.uid && member.active == 1
      )
    );

    const availableTeams = teams.filter(
      (team) =>
        !team.members.find(
          (member) =>
            member.uid == req.session.currentUser.uid && member.active == 1
        )
    );

    res
      .status(200)
      .render("teams/index", { title: "Equipos", userTeams, availableTeams });
  } catch (err) {
    next(err);
  }
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

const getNClosedRetrospectives = async (req, res, next) => {
  try {
    const { id, n } = req.params;
    const team = await Team.getById(id);
    const retrospectives = await team.getNClosedRetrospectives(n);
    res.status(200).json(retrospectives);
  } catch (err) {
    next(err);
  }
};

const addTeam = async (request, response, next) => {
  try {
    let name = request.body.name;
    if (!name) {
      request.session.errorMessage = "No puedes crear un equipo sin nombre";
      return response.redirect("/equipos");
    }
    const newTeam = new Team({
      name,
    });
    const team = await newTeam.post();
    newTeam.id = team.insertId;

    request.session.successMessage = "Equipo creado con éxito";
    response.status(201).redirect("/equipos");
  } catch (err) {
    next(err);
  }
};

const removeTeam = async (req, res, next) => {
  try {
    const { id_team } = req.body;
    const team = await Team.getById(id_team);

    await team.delete(id_team);
    req.session.successMessage = "El equipo se elimino con éxito";
    res.status(200).redirect("/equipos");
  } catch (err) {
    next(err);
  }
};

const renderModifyTeam = async (req, res, next) => {
  try {
    const id_team = req.params.id;
    const team = await Team.getById(id_team);
    const members = await team.getMembers();
    const users = await User.getAll();

    // sort team members by alphabetical order
    users.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name > b.first_name) {
        return 1;
      }
      return 0;
    });

    const userIdsInTeam = members.map((member) => member.uid);
    const usersNotInTeam = users.filter(
      (user) => !userIdsInTeam.includes(user.uid)
    );

    res.render("teams/modifyTeam", {
      title: `Modificar Equipo ${team.name}`,
      team,
      members,
      users,
      usersNotInTeam,
    });
  } catch (err) {
    next(err);
  }
};

const removeUserTeam = async (req, res, next) => {
  try {
    const { id_team, uid } = req.body;

    const team = await Team.getById(id_team);
    await team.removeUser(uid);

    req.session.successMessage = "Usuario eliminado";
    res.status(200).redirect("/equipos/" + id_team + "/modificar");
  } catch (err) {
    next(err);
  }
};

const addUserTeam = async (req, res, next) => {
  try {
    const { id_team, uid } = req.body;

    const team = await Team.getById(id_team);

    await team.addUser(uid);
    req.session.successMessage = "Usuario añadido";
    return res.status(200).redirect("/equipos/" + id_team + "/modificar");
  } catch (err) {
    next(err);
  }
};
module.exports = {
  renderTeams,
  addUser,
  removeUser,
  getNClosedRetrospectives,
  addTeam,
  removeTeam,
  renderModifyTeam,
  removeUserTeam,
  addUserTeam,
};
