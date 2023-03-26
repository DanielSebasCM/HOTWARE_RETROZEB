const express = require("express");
const router = express.Router();


router.post("/mensajes/exito", (req, res) => {
  req.session.successMessage = "";
  res.status(200).json({ message: "success" });
});
router.post("/mensajes/error", (req, res) => {
  req.session.errorMessage = "";
  res.status(200).json({ message: "success" });
});

module.exports = router;
