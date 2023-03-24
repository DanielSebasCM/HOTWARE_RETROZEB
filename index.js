if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const expressLayouts = require("express-ejs-layouts");
const initRoutes = require("./src/routes/index.routes");
const { routes } = require("./src/utils/utils");

// SET VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views/"));
app.set("layout", "layouts/layout");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

// ROUTER
initRoutes(app);

// -------------------------- TEST --------------------------
app.get("/", (_, res) => {
  res.redirect("/login");
});

app.get("/login", (_, res) => {
  app.locals.teams = [];
  app.locals.currentUser = null;
  res.render("index", { title: "Login" });
});

const teamController = require("./src/controllers/team.controller");
app.get("/dashboard", teamController.setLocalTeams, async (req, res) => {

  if (req.app.locals.activeTeams.length == 0)
    await teamController.setLocalTeams(req, res);

  if (req.query.team)
    req.app.locals.selectedTeam = req.app.locals.activeTeams.find(
      (team) => team.id == req.query.team
    );

  res.render("dashboard", { title: "Dashboard" });
});
// -------------------------- FINISH TEST --------------------------

// 404
app.use((_, res) => {
  res.locals.title = "Error 404";
  res.status(404).render("404/index");
});

// LOCALS
app.locals.activeTeams = [];
app.locals.selectedTeam;
app.locals.routes = routes;
app.locals.currentUser;

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
