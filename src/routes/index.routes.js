const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const retrospectiveRouter = require("./retrospective.routes");
const teamController = require("../controllers/team.controller");
const answerRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const localsRouter = require("./locals.routes");
const setLocalsMiddleware = require("../middlewares/locals.middleware");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(setLocalsMiddleware); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.questions}`, questionRouter);
  app.use(`${routes.retrospectives}`, retrospectiveRouter);
};

module.exports = initRoutes;
