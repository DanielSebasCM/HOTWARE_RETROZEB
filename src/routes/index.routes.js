const teamRouter = require("./team.routes");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(`${routes.teams}`, teamRouter);
};

module.exports = initRoutes;
