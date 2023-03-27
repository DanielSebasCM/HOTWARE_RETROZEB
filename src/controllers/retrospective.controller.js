const Retrospective = require("../models/retrospective.model");


const getRetrospectiveQuestions = async (req, res) => {
  const retroId = req.params.id;
  const retrospective = await Retrospective.getById(retroId);
  const questions = await retrospective.getQuestions();
  for (let question of questions) {
    question.answers = await retrospective.getAnswers(question);
  }
  res.render("answers/index", { title: "Answers", questions });
};

const getRetrospectiveAnswers = async (req, res) => {
  const retroId = req.params.id;
  const retrospective = await Retrospective.getById(retroId);
  const questions = await retrospective.getQuestions();
  for (let question of questions) {
    question.answers = await retrospective.getAnswers(question);
  }
  res.send(questions);
};

const getRetrospectiveDashboard = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const labels = await retrospective.getLabels();
    res.render("retrospectiveDashboard", {
      title: "Dashboard",
      retrospective,
      labels,
    });
  } catch (err) {
    next(err);
  }
};

const getLiveSprintIssues = async (req, res) => {};

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

module.exports = {
  getRetrospectiveDashboard,
  getRetrospectiveIssues,
  getRetrospectiveAnswers,
  getRetrospectiveQuestions,
};
