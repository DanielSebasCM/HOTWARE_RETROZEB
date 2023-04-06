const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionable.controller");

// RENDERING ROUTES
router.get("/nuevo", controller.renderNewActionable);
router.get("/", (req, res) => res.redirect(req.originalUrl + "/pending"));
router.get("/:state", controller.renderActionables);

// API ROUTES

// POST
router.post("/nuevo", controller.postActionable);
// rutas para cambiar el estado del accionable
router.post("/:id/accept", controller.acceptActionable);
router.post("/:id/reject", controller.rejectActionable);

module.exports = router;
