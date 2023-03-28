const express = require("express");
const router = express.Router();
const controller = require("../controllers/question.controller");

// RENDERING ROUTES
router.get("/", controller.renderQuestions);

module.exports = router;
