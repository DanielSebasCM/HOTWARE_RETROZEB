const constants = {
  enums: {
    retrospectiveStates: ["PENDING", "IN_PROGRESS", "CLOSED"],
    issuePriorities: ["Lowest", "Low", "Medium", "High", "Highest"],
    issueStates: ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"],
    issueTypes: ["Story", "Task", "Sub-task", "Bug"],
    questionTypes: ["OPEN", "BOOLEAN", "SCALE", "SELECTION"],
    actionableStates: [
      "PENDING",
      "ACCEPTED",
      "REJECTED",
      "COMPLETED",
      "PROCESS",
    ],
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
    logout: "/logout",
    refreshToken: "/token/refresh",
    teams: "/equipos",
    actionables: "/accionables",
    retrospectives: "/retrospectivas",
    questions: "/preguntas",
    roles: "/roles",
    users: "/usuarios",
    locals: "/locals",
    jiraUserID: "/jira/user/id",
  },
  privileges: {
    actionables: {
      getActionables: "getActionables",
      canAcceptActionables: "canAcceptActionables",
      canRejectActionables: "canRejectActionables",
    },
    teams: {
      getTeams: "getTeams",
      canJoinTeams: "canJoinTeams",
      canCreateTeams: "canCreateTeams",
      canModifyTeams: "canModifyTeams",
      canDeleteTeams: "canDeleteTeams",
    },
    questions: {
      getQuestions: "getQuestions",
      canPostQuestions: "canPostQuestions",
      canDeleteQuestions: "canDeleteQuestions",
    },
    roles: {
      getRoles: "getRoles",
      canCreateRoles: "canCreateRoles",
      canDeleteRoles: "canDeleteRoles",
    },
    retrospectives: {
      getRetrospectives: "getRetrospectives",
      canCreateRetrospectives: "canCreateRetrospectives",
      canAnswerRetrospectives: "canAnswerRetrospectives",
      getMetrics: "getMetrics",
      canCompareRetrospectives: "canCompareRetrospectives",
    },
    users: {
      getUsers: "getUsers",
      deleteUsers: "deleteUsers",
      canModifyUsers: "canModifyUsers",
    },
  },
};

module.exports = constants;
