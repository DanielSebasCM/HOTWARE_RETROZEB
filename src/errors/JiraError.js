class JiraError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.type = "JiraError";
  }
}

module.exports = JiraError;
