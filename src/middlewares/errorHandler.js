const { setLocals } = require("./locals.middleware");

const errorHandler = (err, req, res, next) => {
  console.log("Error Handler");
  const errorType = err.constructor.name;
  console.log("Tipo: " + errorType);
  console.log("Mensaje: " + err.message);

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
    default:
      defaultErrorHandler(err, req, res, next);
      break;
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
module.exports = errorHandler;
