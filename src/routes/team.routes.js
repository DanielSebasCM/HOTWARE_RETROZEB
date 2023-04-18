const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.teams;

// RENDERING ROUTES
router.get("/", authorize([privileges.getTeams]), controller.renderTeams);
//router.get("/modificar", controller.renderModifyTeam);
router.get("/:id/modificar", controller.renderModifyTeam);

// API ROUTES
router.get("/:id/retrospectivas/:n", controller.getNClosedRetrospectives);
// POST
router.post(
  "/nuevo/usuario",
  authorize([privileges.canJoinTeams]),
  controller.addUser
);
router.post(
  "/nuevo",
  controller.nuevo
);
router.post(
  "/eliminar",
  controller.removeTeam
);
// DELETE
router.patch("/eliminar/usuario", controller.removeUser);

module.exports = router;
