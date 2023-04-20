const { setLocals } = require("./locals.middleware");
const authUtil = require("../utils/auth");

const errorHandler = (err, req, res, next) => {
  console.log("Error Handler");
  console.log("URL: " + req.url);
  const errorType = err.constructor.name;
  console.log("Tipo: " + errorType);
  console.log(err);

  switch (errorType) {
    case "ValidationError":
      validationErrorHandler(err, req, res);
      break;
    case "TokenExpiredError":
      req.session.errorMessage = "Su sesión ha expirado";
      jwtTokenErrorHandler(err, req, res);
      break;
    case "JsonWebTokenError":
      jwtTokenErrorHandler(err, req, res);
      break;
    case "NotBeforeError":
      jwtNotBeforeErrorHandler(err, req, res);
      break;
    case "JiraError":
      jiraErrorHandler(err, req, res, next);
      break;
    case "Error":
      if (err.code && err.errno) {
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
  const message = `${err.type}, ${err.atribute}, ${err.message}`;
  req.session.errorMessage =
    "Ocurrió un error inesperado, por favor intente de nuevo";
  res.locals.errorView = true;
  res.status(400).render("errors/404", { title: "Error 404" });
}

function defaultErrorHandler(err, req, res, next) {
  req.session.errorMessage =
    "Ocurrió un error inesperado, por favor intente de nuevo";
  setLocals(req, res, next);

  res.locals.errorView = true;
  res.status(500).render("errors/500", { title: "Error Inesperado" });
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
  "jwt expired": "Su sesión ha expirado. Por favor inicie sesión de nuevo",
  "jwt audience invalid. expected: [OPTIONS AUDIENCE]": undefined,
  "jwt issuer invalid. expected: [OPTIONS ISSUER]": undefined,
  "jwt id invalid. expected: [OPTIONS JWT ID]": undefined,
  "jwt subject invalid. expected: [OPTIONS SUBJECT]": undefined,
};

function jwtTokenErrorHandler(err, req, res) {
  req.session.errorMessage = jwtErrorMessages[err.message] || err.message;
  authUtil.deleteSession(req, res);
}

function jwtNotBeforeErrorHandler(err, req, res) {
  req.session.errorMessage = "Su sesión no está disponible";
  authUtil.deleteSession(req, res);
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
// bad column name sqlState 42S22
// bad table name sqlState 42S02
// bad forign key (non-existant or wrong type) sqlState 23000
// bad db name sqlState 42000
// bad user/ password sqlState 28000
// connection failure errno -3001
const sqlStates = {
  "404Error": ["23000"],
};
function dbErrorHandler(err, req, res, next) {
  if (sqlStates["404Error"].includes(err.sqlState)) {
    req.session.errorMessage =
      "Ocurrió un error inesperado, por favor intente de nuevo";

    res.locals.errorView = true;

    res.status(404).render("errors/404", {
      title: "Error 404",
    });
  } else {
    req.session.errorMessage =
      "Ocurrió un error inesperado, por favor intente de nuevo";
    setLocals(req, res, next);

    res.locals.errorView = true;

    res.status(500).render("errors/500", {
      title: "Error 500",
    });
  }
}

function jiraErrorHandler(err, req, res, next) {
  req.session.errorMessage = `Ocurrió un error al conectarse con Jira, por favor contacta un administrador (Status: ${err.status})`;
  setLocals(req, res, next);

  res.locals.errorView = true;
  res.status(500).render("errors/500", {
    title: "Error 500",
  });
}
module.exports = errorHandler;
