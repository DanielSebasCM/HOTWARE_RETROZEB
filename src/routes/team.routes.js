const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");

// RENDERING ROUTES
router.get("/", controller.renderTeams);

// API ROUTES
router.get("/:id/retrospectivas/:n", controller.getNClosedRetrospectives);
// POST
router.post("/nuevo/usuario", controller.addUser);
// DELETE
router.patch("/eliminar/usuario", controller.removeUser);

module.exports = router;
