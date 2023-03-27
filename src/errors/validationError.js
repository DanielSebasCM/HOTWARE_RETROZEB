class ValidationError extends Error {
  constructor(atribute, message) {
    super(message);
    this.type = "ValidationError";
    this.atribute = atribute;
  }
}

module.exports = ValidationError;
