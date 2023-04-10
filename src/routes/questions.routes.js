const express = require("express");
const router = express.Router();
const controller = require("../controllers/question.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.questions;

// RENDERING ROUTES
router.get(
  "/",
  authorize([privileges.getQuestions]),
  controller.renderQuestions
);

// POSTING QUESTIONS
router.get(
  "/nueva",
  authorize([privileges.canPostQuestions]),
  controller.renderNewQuestion
);
router.post(
  "/nueva",
  authorize([privileges.canPostQuestions]),
  controller.postQuestion
);

// DELETING QUESTIONS
router.delete(
  "/",
  authorize([privileges.canDeleteQuestions]),
  controller.deleteQuestion
);

module.exports = router;
