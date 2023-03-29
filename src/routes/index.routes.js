const publicRouter = require("./public.routes");
const teamRouter = require("./team.routes");
const actionableRouter = require("./actionable.routes");
const retrospectiveRouter = require("./retrospective.routes");
const questionRouter = require("./questions.routes");
const localsRouter = require("./locals.routes");
const { setLocals } = require("../middlewares/locals.middleware");
const { routes } = require("../utils/constants");

// Temporary imports for testing errors
const ValidationError = require("../errors/ValidationError");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

let firstValidation = true;
let firstJwt = true;
let firstDb = true;

const initRoutes = (app) => {
  app.use(setLocals); // MIDDLEWARE
  app.use("/", publicRouter);

  // Temporary routes for testing errors
  app.use("/default_error", (req, res, next) => {
    next(new Error("Error de prueba"));
  });

  app.use("/validation_error", (req, res, next) => {
    if (firstValidation) {
      firstValidation = false;
      next(new ValidationError("Atributo de prueba", "Mensaje de prueba"));
      return;
    }
    res.render("utils", { title: "Error de validación" });
  });

  app.use("/jwt_error", (req, res, next) => {
    if (firstJwt) {
      firstJwt = false;
      next(new jwt.TokenExpiredError("jwt expired", new Date()));
      return;
    }
    res.render("utils", { title: "Error de validación" });
  });

  app.use("/db_error", async (req, res, next) => {
    if (firstDb) {
      try {
        firstDb = false;
        await db.query("SELECT * FROM not_a_table");
      } catch (err) {
        next(err);
      }
      return;
    }
    res.render("utils", { title: "Error de validación" });
  });

  app.use(`${routes.locals}`, localsRouter);
  app.use(`${routes.teams}`, teamRouter);
  app.use(`${routes.actionables}`, actionableRouter);
  app.use(`${routes.questions}`, questionRouter);
  app.use(`${routes.retrospectives}`, retrospectiveRouter);
};

module.exports = initRoutes;
