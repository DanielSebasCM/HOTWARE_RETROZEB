const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionable.controller");

router.get("/", controller.getDefault);
router.get("/:state", controller.getActionables);

module.exports = router;
