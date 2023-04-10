const express = require("express");
const router = express.Router();
const controller = require("../controllers/roles.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.roles;

// RENDERING ROUTES
router.get("/", authorize([privileges.getRoles]), controller.renderRoles);

module.exports = router;
