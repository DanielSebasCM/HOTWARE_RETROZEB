const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.teams;

// RENDERING ROUTES
router.get("/", authorize([privileges.getTeams]), controller.renderTeams);
router.get("/:id/modificar",authorize([privileges.canModifyTeams]), controller.renderModifyTeam);

// API ROUTES
router.get("/:id/retrospectivas/:n", controller.getNClosedRetrospectives);
// POST
router.post(
  "/nuevo/usuario",
  authorize([privileges.canJoinTeams]),
  controller.addUser
);
router.post(
  "/nuevo", authorize([privileges.canCreateTeams]),
  controller.nuevo
);
router.post(
  "/eliminar",authorize([privileges.canDeleteTeams]),
  controller.removeTeam
);
router.post(
  "/modificar/eliminar",
  controller.removeUserTeam
);
router.post(
  "/modificar/anadir",
  controller.addUserTeam
);
// DELETE
router.patch("/eliminar/usuario", controller.removeUser);

module.exports = router;
