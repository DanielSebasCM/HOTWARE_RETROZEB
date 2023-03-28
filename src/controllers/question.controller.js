const Question = require("../models/question.model");

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.getAll();
    res.render("questions", { questions: questions, title: "Preguntas" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllQuestions,
};
