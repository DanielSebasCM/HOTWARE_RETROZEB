const express = require("express");
const router = express.Router();
const controller = require("../controllers/roles.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.roles;

// RENDERING ROUTES
router.get("/", authorize([privileges.getRoles]) ,controller.renderRoles);

// POSTING ROLES
router.get("/nuevo", controller.renderNewRole);
router.post("/nuevo", controller.postRole);

// MODIFYING ROLES
router.get("/:id/modificar", controller.renderModifyRole);
router.patch("/:id/modificar", controller.modifyRole);

// DELETING ROLES
router.delete("/:id/modificar", controller.deleteRole);

module.exports = router;
