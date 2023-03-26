const validationErrorHandler = (err, req, res, next) => {
  res.status(400).send(`${err.type}, ${err.atribute}, ${err.message}`);
};

module.exports = validationErrorHandler;
