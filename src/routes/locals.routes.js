const express = require("express");
const router = express.Router();
const controller = require("../middlewares/locals.middleware");

router.post("/", () => {
  controller.setLocals;
});

router.post("/activeteam", (req, res) => {
  const { activeTeam } = req.body;
  req.session.selectedTeam = activeTeam;
  res.status(301).redirect(req.headers.referer);
});

router.post("/mensajes", (req, res) => {
  const { type } = req.body;
  if (type == "exito") req.session.successMessage = "";
  if (type == "error") req.session.errorMessage = "";

  res.status(301).json({ message: "success" });
});

module.exports = router;
