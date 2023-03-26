const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");

// RENDERING ROUTES
router.get("/:id", controller.getRetrospectiveDashboard);

// API ROUTES
router.get("/:id/issues", controller.getRetrospectiveIssues);

module.exports = router;
