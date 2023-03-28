const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const retrospectiveRouter = require("./retrospective.routes");
const teamController = require("../controllers/team.controller");
const answerRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const localsRouter = require("./locals.routes");
const setLocalsMiddleware = require("../middleware/locals.middleware");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(setLocalsMiddleware); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.retrospectives}`, answerRouter);
  app.use(`${routes.retrospective}`, retrospectiveRouter);
  app.use(`${routes.questions}`, questionRouter);
};

module.exports = initRoutes;
