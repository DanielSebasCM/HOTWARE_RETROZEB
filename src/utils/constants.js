const constants = {
  enums: {
    retrospectiveStates: ["PENDING", "IN_PROGRESS", "CLOSED"],
    issuePriorities: ["Lowest", "Low", "Medium", "High", "Highest"],
    issueStates: ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"],
    issueTypes: ["Story", "Task", "Bug"],
    questionTypes: ["OPEN", "BOOLEAN", "SCALE", "SELECTION"],
    actionableStates: ["PENDING", "ACCEPTED", "REJECTED"],
  },
  limits: {
    answerMaxLength: 400,
    epicsNameMaxLength: 255,
    privilegeMaxLength: 255,
    projectMaxLength: 255,
    questionMaxLength: 255,
    optionMaxLength: 25,
    retrospectiveMaxLength: 255,
    roleMaxLength: 40,
    sprintMaxLength: 255,
    toDoTitleMaxLength: 40,
    toDoDescriptionMaxLength: 255,
    teamNameMaxLength: 40,
  },
  routes: {
    home: "/",
    login: "/login",
    teams: "/equipos",
    actionables: "/accionables",
    retrospectives: "/retrospectivas",
    questions: "/preguntas",
    locals: "/locals",
  },
};

module.exports = constants;
