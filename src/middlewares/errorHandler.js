const validationErrorHandler = require("./validationErrorHandler");

const errorHandler = (err, req, res, next) => {
  validationErrorHandler(err, req, res, next);
};
