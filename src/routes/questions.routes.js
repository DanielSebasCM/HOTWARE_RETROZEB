const express = require("express");
const router = express.Router();
const controller = require("../controllers/question.controller");

// Rendering the questions page
router.get("/", controller.getAllQuestions);

module.exports = router;