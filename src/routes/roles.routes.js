const express = require("express");
const router = express.Router();
const controller = require("../controllers/roles.controller");

// RENDERING ROUTES
router.get("/", controller.renderRoles);

// POSTING ROLES
router.get("/nuevo", controller.renderNewRole);
router.post("/nuevo", controller.postRole);

// DELETING ROLES
router.delete("/", controller.deleteRole);

module.exports = router;