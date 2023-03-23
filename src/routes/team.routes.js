const express = require("express");
const router = express.Router();
const controller = require("../controllers/team.controller");

router.get("/", controller.getAll);
router.get("/activos", controller.getAllActive);

module.exports = router;
