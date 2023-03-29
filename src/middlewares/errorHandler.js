const { setLocals } = require("./locals.middleware");

const errorHandler = (err, req, res, next) => {
  console.log("Error Handler");
  const errorType = err.constructor.name;
  console.log("Tipo: " + errorType);
  console.log(err);

  switch (errorType) {
    case "ValidationError":
      validationErrorHandler(err, req, res);
      break;
    case "TokenExpiredError":
      req.session.errorMessage = "Su sesión ha expirado";
      res.redirect("/login");
      break;
    case "JsonWebTokenError":
      jwtTokenErrorHandler(err, req, res);
      break;
    case "NotBeforeError":
      jwtNotBeforeErrorHandler(err, req, res);
      break;
    case "Error":
      if (err.sqlMessage) {
        console.log("DB Error");
        dbErrorHandler(err, req, res, next);
      } else {
        defaultErrorHandler(err, req, res, next);
      }
      break;
    default:
      defaultErrorHandler(err, req, res, next);
  }
};

function validationErrorHandler(err, req, res) {
  req.session.errorMessage = `${err.type}, ${err.atribute}, ${err.message}`;
  res.redirect(req.originalUrl);
}

function defaultErrorHandler(err, req, res, next) {
  req.session.errorMessage = err.message;
  setLocals(req, res, next);
  res.status(500).render("errors/500", { title: "Error 500" });
}

// jasonwebtoken error messages
// https://www.npmjs.com/package/jsonwebtoken
// Errors section
// TODO add more error messages
const jwtErrorMessages = {
  "Invalid token signature": "Acceso denegado",
  "jwt malformed": undefined,
  "jwt signature is required": undefined,
  "invalid signature": undefined,
  "jwt audience invalid. expected: [OPTIONS AUDIENCE]": undefined,
  "jwt issuer invalid. expected: [OPTIONS ISSUER]": undefined,
  "jwt id invalid. expected: [OPTIONS JWT ID]": undefined,
  "jwt subject invalid. expected: [OPTIONS SUBJECT]": undefined,
};

function jwtTokenErrorHandler(err, req, res) {
  req.session.errorMessage = jwtErrorMessages[err.message] || err.message;
  res.redirect("/login");
}

function jwtNotBeforeErrorHandler(err, req, res) {
  req.session.errorMessage = "Su sesión no está disponible";
  res.redirect("/login");
}

// Structure of a DB error
// {
//   code: "ER_NO_SUCH_TABLE",
//   errno: 1146,
//   sql: "SELECT * FROM not_a_table",
//   sqlState: "42S02",
//   sqlMessage: "Table 'hotware.not_a_table' doesn't exist",
// };
// https://mariadb.com/kb/en/mariadb-error-codes/

function dbErrorHandler(err, req, res, next) {
  // TODO: ADD BETTER ERROR MESSAGES
  req.session.errorMessage = err.sqlMessage;
  setLocals(req, res, next);
  res.status(500).render("errors/500", { title: "Error 500" });
}

module.exports = errorHandler;
