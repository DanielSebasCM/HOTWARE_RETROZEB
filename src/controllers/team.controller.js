const Team = require("../models/team.model");

const getAll = async (_, res) => {
  try {
    let teams = await Team.getAll();
    res.status(200).json(teams);
  } catch (err) {
    console.log(err.message);
    res.render("500/index", { error: err });
  }
};

const getAllActive = async (_, res) => {
  try {
    let teams = await Team.getAllActive();
    res.status(200).json(teams);
  } catch (err) {
    console.log(err.message);
    res.render("500/index", { error: err });
  }
};

const setLocalTeams = async (req, res, next) => {
  try {
    let teams = await Team.getAllActive();
    req.app.locals.teams = teams;
    if (!req.app.locals.selectedTeam) req.app.locals.selectedTeam = teams[0];
    if (next) next();
    return teams;
  } catch (err) {
    console.log(err.message);
    res.render("500/index", { error: err });
  }
};

module.exports = {
  getAll,
  getAllActive,
  setLocalTeams,
};
