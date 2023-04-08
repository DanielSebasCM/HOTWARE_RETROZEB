const authRouter = require("./auth.routes");
const teamRouter = require("./team.routes");
const actionableRouter = require("./actionable.routes");
const retrospectiveRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const rolesRouter = require("./roles.routes");
const localsRouter = require("./locals.routes");
const authMiddleware = require("../middlewares/auth");
const { setLocals } = require("../middlewares/locals.middleware");
const { routes } = require("../utils/constants");

// Temporary imports for testing errors
const ValidationError = require("../errors/ValidationError");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

const initRoutes = (app) => {
  app.use("/", authRouter);
  app.use(authMiddleware.validateTokenActive); // MIDDLEWARE
  app.use(setLocals); // MIDDLEWARE

  // Temporary routes for testing errors
  app.use("/default_error", (req, res, next) => {
    next(new Error("Error de prueba"));
  });

  app.use("/validation_error", (req, res, next) => {
    next(new ValidationError("Atributo de prueba", "Mensaje de prueba"));
  });

  app.use("/jwt_error", (req, res, next) => {
    next(new jwt.TokenExpiredError("jwt expired", new Date()));
  });

  app.use("/db_error", async (req, res, next) => {
    try {
      await db.query(
        "INSERT INTO team_users (id_team, uid) VALUES (1, 'test')"
      );
    } catch (err) {
      next(err);
    }
  });

  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.actionables}`, actionableRouter);
  app.use(`${routes.questions}`, questionRouter);
  app.use(`${routes.retrospectives}`, retrospectiveRouter);
  app.use(`${routes.roles}`, rolesRouter);
};

module.exports = initRoutes;
