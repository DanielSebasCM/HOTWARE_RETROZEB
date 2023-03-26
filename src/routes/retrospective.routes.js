const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");

router.get("/", controller.getRetrospective);

module.exports = router;