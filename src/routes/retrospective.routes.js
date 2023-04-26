const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.retrospectives;

// RENDERING ROUTES
router.get(
  "/",
  authorize([privileges.getRetrospectives]),
  controller.renderRetrospectives
);
router.get(
  "/iniciar",
  authorize([privileges.canCreateRetrospectives]),
  controller.renderInitRetrospective
);
router.get(
  "/comparar/:n",
  authorize([privileges.canCompareRetrospectives]),
  controller.renderCompareRetroMetrics
);
router.get("/:id", authorize([privileges.getMetrics]), (req, res) =>
  res.redirect(req.originalUrl + "/metricas")
);
router.get(
  "/:id/metricas",
  authorize([privileges.getMetrics]),
  controller.renderRetrospectiveMetrics
);
router.get(
  "/:id/preguntas",
  authorize([privileges.getMetrics]),
  controller.renderRetrospectiveQuestions
);
router.get(
  "/:id/contestar",
  authorize([privileges.canAnswerRetrospectives]),
  controller.renderRetrospectiveAnswer
);

// API ROUTES
router.get("/:id/sprint", controller.getSprint);

// GET
router.get(
  "/:id/issues",
  authorize([privileges.getMetrics]),
  controller.getRetrospectiveIssues
);
router.get(
  "/:id/respuestas",
  authorize([privileges.getMetrics]),
  controller.getRetrospectiveAnswers
);
router.get(
  "/:id/usuarios",
  authorize([privileges.getMetrics]),
  controller.getRetrospectiveUsers
);

// POST
router.post(
  "/iniciar",
  authorize([privileges.canCreateRetrospectives]),
  controller.post
);
router.post(
  "/:id/contestar",
  authorize([privileges.canAnswerRetrospectives]),
  controller.postRetrospectiveAnswers
);

// PATCH
router.patch(
  "/:id/cerrar",
  authorize([privileges.canCloseRetrospectives]),
  controller.patchRetrospectiveState
);

module.exports = router;
