const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionable.controller");

router.get("/", controller.getDefault);
router.get("/:state", controller.getActionables);
// ruta con accionables pendientes
router.post("/:id/accept", controller.accept);
router.post("/:id/reject", controller.reject);

module.exports = router;
