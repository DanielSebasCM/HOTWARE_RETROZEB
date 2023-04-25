const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.teams;
const retrospectivePrivileges =
  require("../utils/constants").privileges.retrospectives;

// RENDERING ROUTES
router.get("/", authorize([privileges.getTeams]), controller.renderTeams);
router.get(
  "/:id/modificar",
  authorize([privileges.canModifyTeams]),
  controller.renderModifyTeam
);

// API ROUTES
router.get(
  "/:id/retrospectivas/:n",
  authorize([retrospectivePrivileges.canCompareRetrospectives]),
  controller.getNClosedRetrospectives
);

// POST
router.post(
  "/nuevo/usuario",
  authorize([privileges.canJoinTeams]),
  controller.addUser
);
router.post(
  "/nuevo",
  authorize([privileges.canCreateTeams]),
  controller.addTeam
);
router.post(
  "/eliminar",
  authorize([privileges.canDeleteTeams]),
  controller.removeTeam
);
router.post(
  "/modificar/eliminar",
  authorize([privileges.canDeleteTeams]),
  controller.removeUserTeam
);
router.post(
  "/modificar/anadir",
  authorize([privileges.canCreateTeams]),
  controller.addUserTeam
);

// DELETE
router.patch(
  "/eliminar/usuario",
  authorize([privileges.canModifyTeams]),
  controller.removeUser
);

module.exports = router;
