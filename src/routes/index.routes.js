const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const localsRouter = require("./locals.routes");
const setLocalsMiddleware = require("../middleware/locals.middleware");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(setLocalsMiddleware); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
};

module.exports = initRoutes;
