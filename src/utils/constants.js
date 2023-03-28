const constants = {
  enums: {
    retrospectiveStates: ["PENDING", "IN_PROGRESS", "CLOSED"],
    issuePriorities: ["Lowest", "Low", "Medium", "High", "Highest"],
    issueStates: ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"],
    questionTypes: ["OPEN", "BOOLEAN", "SCALE", "SELECTION"],
    actionableStates: ["PENDING", "ACCEPTED", "REJECTED"],
  },
};

module.exports = constants;
