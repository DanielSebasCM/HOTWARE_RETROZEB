const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionable.controller");

// RENDERING ROUTES
router.get("/", (req, res) => res.redirect(req.originalUrl + "/pending"));
router.get("/:state", controller.renderActionables);

// API ROUTES

// POST
// rutas para cambiar el estado del accionable
router.post("/:id/accept", controller.acceptActionable);
router.post("/:id/reject", controller.rejectActionable);

module.exports = router;
