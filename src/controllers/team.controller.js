const Team = require("../models/team.model");

const getAll = async (_, res) => {
  try {
    let teams = await Team.getAll();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllActive = async (_, res) => {
  try {
    let teams = await Team.getAllActive();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setLocalTeams = async (req, res, next) => {
  console.log("setLocalTeams");
  try {
    let teams = await Team.getAllActive();
    req.app.locals.teams = teams;
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
    if (next) next();
    return teams;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  getAll,
  getAllActive,
  setLocalTeams,
};
