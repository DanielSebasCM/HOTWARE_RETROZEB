const express = require("express");
const authorize = require("../middlewares/privilege");
const controller = require("../controllers/dashboard.controller");
const router = express.Router();
// const controller = require("../middlewares/dashboard.middleware");

router.get("/", authorize([]), controller.renderDashboard);

module.exports = router;
