const validationErrorHandler = require("./validationErrorHandler");
const validateErrorMessage = require("../utils/validateErrorMessage");
const ValidationError = require("../errors/ValidationError");

const errorHandler = (err, req, res, next) => {
  console.log("Error Handler");
  console.log(err);

  req.session.errorMessage = validateErrorMessage(err);

  if (err instanceof ValidationError) {
    validationErrorHandler(err, req, res, next);
  } else {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = errorHandler;
