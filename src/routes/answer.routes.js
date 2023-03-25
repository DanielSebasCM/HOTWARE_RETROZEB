const express = require("express");
const router = express.Router();
const controller = require("../controllers/answer.controller");

// GET
router.get("/retrospectiva/:id", controller.getRetrospectiveAnswers);

module.exports = router;
