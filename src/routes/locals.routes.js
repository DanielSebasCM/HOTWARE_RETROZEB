const express = require("express");
const router = express.Router();
const controller = require("../middlewares/locals.middleware");

router.post("/", () => {
  controller.setLocals;
});

router.post("/mensajes", (req, res) => {
  const { type } = req.body;

  if (type == "exito") req.session.successMessage = "";
  if (type == "error") req.session.errorMessage = "";

  res.status(301).json({ message: "success" });
});

module.exports = router;
