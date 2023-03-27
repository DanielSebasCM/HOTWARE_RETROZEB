const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const teamController = require("../controllers/team.controller");
const answerRouter = require("./retrospective.routes");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(teamController.setLocalTeams); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.retrospectives}`, answerRouter);
};

module.exports = initRoutes;
