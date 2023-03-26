const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const actionableRouter = require("./actionable.routes");
const teamController = require("../controllers/team.controller");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(teamController.setLocalTeams); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.actionables}`, actionableRouter);
};

module.exports = initRoutes;
