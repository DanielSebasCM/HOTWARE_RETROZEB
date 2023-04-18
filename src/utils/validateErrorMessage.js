// Array of arrays from error messages to be validated
// const errorMessages = [
// ["Server error to validate", "Message to return"],
// ["Server error2 to validate", "Message to return"]
// ]

const errorMessages = [["Invalid token signature", "Acceso denegado"]];

const validateErrorMessage = (error) => {
  const { message } = error;
  let errorMessage = message;

  errorMessages.forEach((msg) => {
    if (message.includes(msg[0])) {
      errorMessage = msg[1];
    }
  });

  return errorMessage;
};

module.exports = validateErrorMessage;
