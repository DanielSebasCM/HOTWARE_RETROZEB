// Validate date format
// YYYY-MM-DD HH:MM:SS STING
// OR
// DATE OBJECT (new Date())
const isValidDate = (date) => {
  if (Object.prototype.toString.call(input) === "[object Date]") {
    return !isNaN(date.getTime());
  }

  const regEx = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

  const dateTimeArray = date.match(regEx);

  if (dateTimeArray === null) return false;

  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) return false;

  return true;
};

module.exports = isValidDate;
