const Retrospective = require("../models/retrospective.model");
const Question = require("../models/question.model");

const getRetrospectiveAnswers = async (req, res) => {
  const retroId = req.params.id;
  const retrospective = await Retrospective.getById(retroId);
  const questions = await retrospective.getQuestions();
  for (question of questions) {
    question.answers = await retrospective.getAnswers(question);
  }
  console.log(questions[3].answers);
  res.render("answers/index", { title: "Answers", questions });
};

module.exports = {
  getRetrospectiveAnswers,
};
