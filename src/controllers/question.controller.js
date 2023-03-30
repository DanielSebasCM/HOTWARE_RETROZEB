const Question = require("../models/question.model");

const renderQuestions = async (req, res, next) => {
  try {
    const questions = await Question.getAllActive();
    res.render("questions", { questions, title: "Preguntas" });
  } catch (err) {
    next(err);
  }
};

const renderNewQuestion = (req, res) => {
  res.render("questions/new", { title: "Nueva pregunta" });
};

const postQuestion = async (req, res, next) => {
  try {
    const { description, type, option } = req.body;
    const newQuestion = new Question({ description, type, options: option });
    await newQuestion.post();
    res.redirect("/preguntas");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderQuestions,
  renderNewQuestion,
  postQuestion,
};
