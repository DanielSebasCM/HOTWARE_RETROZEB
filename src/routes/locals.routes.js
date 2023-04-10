const express = require("express");
const router = express.Router();
const controller = require("../middlewares/locals.middleware");

router.post("/", () => {
  controller.setLocals;
});

router.post("/activeteam", (req, res) => {
  let { activeTeam } = req.body;
  activeTeam = activeTeam.split("-");

  const team = {
    id: activeTeam[0],
    name: activeTeam[1],
  };

  req.session.selectedTeam = team;
  res.locals.selectedTeam = team;

  res.status(301).redirect(req.headers.referer);
});

module.exports = router;
