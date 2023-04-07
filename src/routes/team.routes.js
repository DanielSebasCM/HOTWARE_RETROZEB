const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.teams;

// RENDERING ROUTES
router.get("/", authorize([privileges.getTeams]), controller.renderTeams);

// API ROUTES

// POST
router.post(
  "/nuevo/usuario",
  authorize([privileges.canJoinTeams]),
  controller.addUser
);
// DELETE
router.patch("/eliminar/usuario", controller.removeUser);

module.exports = router;
