const teamRouter = require("./team.routes");

const initRoutes = (app) => {
  app.use("/equipos", teamRouter);
};

module.exports = initRoutes;
