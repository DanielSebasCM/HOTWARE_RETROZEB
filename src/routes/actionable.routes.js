const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionable.controller");
const authorize = require("../middlewares/privilege");
const { auth } = require("google-auth-library");
const privileges = require("../utils/constants").privileges.actionables;

// RENDERING ROUTES
router.get("/nuevo", authorize([privileges.canCreateActionables]) ,controller.renderNewActionable);
router.get("/", authorize([privileges.getActionables]), (req, res) => res.redirect(req.originalUrl + "/pending"));
router.get("/:state", authorize([privileges.getActionables]), controller.renderActionables);

// POST
router.post("/nuevo", authorize([privileges.canCreateActionables]) , controller.postActionable);

// rutas para cambiar el estado del accionable
router.post("/:id/accept", authorize([privileges.canAcceptActionables]), controller.acceptActionable);
router.post("/:id/reject", authorize([privileges.canRejectActionables]), controller.rejectActionable);

module.exports = router;
