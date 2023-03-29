const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { routes } = require("../utils/constants");

// GET
router.get("/", async (req, res) => {
  if (req.query.team)
    req.app.locals.selectedTeam = req.app.locals.activeTeams.find(
      (team) => team.id == req.query.team
    );

  res.render("utils", { title: "Utils" });
});

// LOGIN
router.get(`${routes.login}`, authController.renderLogin);
router.post(`${routes.login}`, authController.loginAPI);

module.exports = router;
