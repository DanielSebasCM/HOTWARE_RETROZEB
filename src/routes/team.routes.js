const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");

// GET
router.get("/", controller.getAllWithUsers);

// POST
router.post("/nuevo/usuario", controller.addUserToTeam);

module.exports = router;
