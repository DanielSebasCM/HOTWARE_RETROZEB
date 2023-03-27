const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");

// GET
router.get("/:id/preguntas", controller.getRetrospectiveQuestions);
router.get("/:id/respuestas", controller.getRetrospectiveAnswers);

module.exports = router;
