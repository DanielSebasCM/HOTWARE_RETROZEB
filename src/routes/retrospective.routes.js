const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");

// RENDERING ROUTES
router.get("/", controller.renderRetrospectives);
router.get("/iniciar", controller.renderInitRetrospective);

router.get("/:id", (req, res) => res.redirect(req.originalUrl + "/metricas"));
router.get("/:id/metricas", controller.renderRetrospectiveMetrics);
router.get("/:id/preguntas", controller.renderRetrospectiveQuestions);

// API ROUTES

// GET
router.get("/:id/issues", controller.getRetrospectiveIssues);
router.get("/:id/respuestas", controller.getRetrospectiveAnswers);
router.get("/:id/usuarios", controller.getRetrospectiveUsers);

module.exports = router;
