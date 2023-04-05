const express = require("express");
const router = express.Router();
const controller = require("../controllers/roles.controller");

// RENDERING ROUTES
router.get("/", controller.renderRoles);

module.exports = router;