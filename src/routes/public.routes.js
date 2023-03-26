const express = require("express");
const router = express.Router();
const { routes } = require("../utils/utils");

// GET
router.get("/", async (req, res) => {
  if (req.query.team)
    req.app.locals.selectedTeam = req.app.locals.activeTeams.find(
      (team) => team.id == req.query.team
    );

  res.render("dashboard/index", { title: "Dashboard" });
});

// LOGIN
router.get(`${routes.login}`, (req, res) => {
  // LOCALS
  req.app.locals.teams = [];
  req.app.locals.currentUser = null;

  // SESSION
  req.session.successMessage = "";
  req.session.errorMessage = "";

  res.render("index", { title: "Login" });
});

module.exports = router;
