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

module.exports = {
  getRetrospectiveAnswers,
  getRetrospectiveQuestions,
};
