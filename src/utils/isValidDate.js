// Validate date format
// YYYY-MM-DD HH:MM:SS
const isValidDate = (date) => {
  const regEx = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

  const dateTimeArray = date.match(regEx);

  if (dateTimeArray === null) return false;

  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) return false;

  return true;
};

module.exports = isValidDate;
