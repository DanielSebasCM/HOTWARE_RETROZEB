const Retrospective = require("../models/retrospective.model");

const getRetrospectiveAnswers = async (req, res) => {
  const retroId = req.params.id;
  const retrospective = await Retrospective.getById(retroId);
  const questions = await retrospective.getQuestions();
  res.render("answers/index", { title: "Answers" });
};

module.exports = {
  getRetrospectiveAnswers,
};
