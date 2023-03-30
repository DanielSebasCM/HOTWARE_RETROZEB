const express = require("express");
const router = express.Router();
const controller = require("../controllers/question.controller");

// RENDERING ROUTES
router.get("/", controller.renderQuestions);

// POSTING QUESTIONS
router.get("/nueva", controller.renderNewQuestion);
router.post("/nueva", controller.postQuestion);

module.exports = router;
