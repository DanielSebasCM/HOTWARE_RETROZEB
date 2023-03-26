const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;

const validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      message:
        "Error de validaci[on de datos, atributo: " +
        err.atribute +
        ", mensaje: " +
        err.message,
    });
  } else {
    next(err);
  }
};

module.exports = validationErrorHandler;
