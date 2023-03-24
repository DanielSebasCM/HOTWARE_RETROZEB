const teamRouter = require("./team.routes");
const teamController = require("../controllers/team.controller");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(teamController.setLocalTeams);
  app.use(`${routes.teams}`, teamRouter);
};

module.exports = initRoutes;
