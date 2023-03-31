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

module.exports = router;
