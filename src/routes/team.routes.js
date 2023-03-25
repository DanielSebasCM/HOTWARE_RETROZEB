const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");

// GET
router.get("/", controller.getAllWithUsers);

// POST
router.post("/nuevo/usuario", controller.addUserToTeam);

// DELETE
router.patch("/eliminar/usuario", controller.removeUserFromTeam);

module.exports = router;