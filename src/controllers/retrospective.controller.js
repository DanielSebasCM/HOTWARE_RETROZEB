const Retrospective = require("../models/retrospective.model");
const Team = require("../models/team.model");
const Question = require("../models/question.model");
const Sprint = require("../models/sprint.model");
const moment = require("moment");
moment.locale("es");

const renderRetrospectives = async (req, res, next) => {
  try {
    const retrospectives = await Retrospective.getAll();
    for (let retrospective of retrospectives) {
      const sprint = await Sprint.getById(retrospective.id_sprint);
      retrospective.sprint_name = sprint.name;
    }
    res.status(200).render("retrospectives/index", {
      title: "Retrospectivas",
      retrospectives,
      moment,
    });
  } catch (err) {
    next(err);
  }
};

const renderInitRetrospective = async (req, res, next) => {
  try {
    const questions = await Question.getAll();
    res.render("retrospectives/initRetrospective", {
      title: "Preguntas",
      questions,
    });
  } catch (err) {
    next(err);
  }
};

const renderRetrospectiveQuestions = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
    }
    res.render("retrospectives/dashboardQuestions", {
      title: "Dashboard",
      retrospective,
      questions,
    });
  } catch (err) {
    next(err);
  }
};

const renderRetrospectiveMetrics = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const team = await Team.getById(retrospective.id_team);
    retrospective.team_name = team.name;
    const labels = await retrospective.getLabels();
    res.render("retrospectives/dashboardMetrics", {
      title: "Dashboard",
      retrospective,
      labels,
    });
  } catch (err) {
    next(err);
  }
};

const getRetrospectiveAnswers = async (req, res, next) => {
  try {
    const retroId = req.params.id;
    const retrospective = await Retrospective.getById(retroId);
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
    }
    res.send(questions);
  } catch (err) {
    console.log(err);
  }
};

const getRetrospectiveIssues = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const issues = await retrospective.getIssues();
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

const getRetrospectiveUsers = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const users = await retrospective.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderRetrospectives,
  renderInitRetrospective,
  renderRetrospectiveMetrics,
  renderRetrospectiveQuestions,
  getRetrospectiveIssues,
  getRetrospectiveAnswers,
  getRetrospectiveUsers,
};
