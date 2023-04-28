const authRouter = require("./auth.routes");
const teamRouter = require("./team.routes");
const actionableRouter = require("./actionable.routes");
const retrospectiveRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const rolesRouter = require("./roles.routes");
const localsRouter = require("./locals.routes");
const userRouter = require("./user.routes");
const dashboardRouter = require("./dashboard.routes");
const authMiddleware = require("../middlewares/auth");
const { setLocals } = require("../middlewares/locals.middleware");
const { routes } = require("../utils/constants");

const initRoutes = (app) => {
  // PUBLIC ROUTES
  app.use("/", authRouter);

  // MIDDLEWARES
  app.use(authMiddleware.validateTokenActive);
  app.use(authMiddleware.verifyJiraUserId);
  app.use(setLocals);

  // PRIVATE ROUTES

  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.actionables}`, actionableRouter);
  app.use(`${routes.questions}`, questionRouter);
  app.use(`${routes.retrospectives}`, retrospectiveRouter);
  app.use(`${routes.roles}`, rolesRouter);
  app.use(`${routes.users}`, userRouter);
  app.use(`${routes.dashboard}`, dashboardRouter);
};

module.exports = initRoutes;
