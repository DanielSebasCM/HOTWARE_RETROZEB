const express = require("express");
const router = express.Router();
const controller = require("../controllers/roles.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.roles;

// RENDERING ROUTES
router.get("/", authorize([privileges.getRoles]), controller.renderRoles);

// POSTING ROLES
router.get(
  "/nuevo",
  authorize([privileges.canCreateRoles]),
  controller.renderNewRole
);
router.post(
  "/nuevo",
  authorize([privileges.canCreateRoles]),
  controller.postRole
);

// MODIFYING ROLES
router.get(
  "/:id/modificar",
  authorize([privileges.canModifyRoles]),
  controller.renderModifyRole
);
router.patch(
  "/:id/modificar",
  authorize([privileges.canModifyRoles]),
  controller.modifyRole
);

// DELETING ROLES
router.delete(
  "/:id/eliminar",
  authorize([privileges.canDeleteRoles]),
  controller.deleteRole
);

module.exports = router;
