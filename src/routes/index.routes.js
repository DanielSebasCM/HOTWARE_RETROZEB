const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const actionableRouter = require("./actionable.routes");
const retrospectiveRouter = require("./retrospective.routes");
const answerRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const localsRouter = require("./locals.routes");
const { setLocals } = require("../middleware/locals.middleware");
const { routes } = require("../utils/utils");

const initRoutes = (app) => {
  app.use(setLocals); // MIDDLEWARE
  app.use("/", publicRouter);
  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.actionables}`, actionableRouter);
  app.use(`${routes.questions}`, questionRouter);
  app.use(`${routes.retrospectives}`, retrospectiveRouter);
};

module.exports = initRoutes;
