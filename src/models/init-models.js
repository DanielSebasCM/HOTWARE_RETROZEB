var DataTypes = require("sequelize").DataTypes;
var _answer = require("./answer");
var _hindsight = require("./hindsight");
var _hindsight_questions = require("./hindsight_questions");
var _issue = require("./issue");
var _issues_labels = require("./issues_labels");
var _label = require("./label");
var _option = require("./option");
var _pending_todo = require("./pending_todo");
var _privilege = require("./privilege");
var _project = require("./project");
var _question = require("./question");
var _role = require("./role");
var _roles_privileges = require("./roles_privileges");
var _sprint = require("./sprint");
var _team = require("./team");
var _teams_labels = require("./teams_labels");
var _teams_users = require("./teams_users");
var _user = require("./user");
var _users_roles = require("./users_roles");

function initModels(sequelize) {
  var answer = _answer(sequelize, DataTypes);
  var hindsight = _hindsight(sequelize, DataTypes);
  var hindsight_questions = _hindsight_questions(sequelize, DataTypes);
  var issue = _issue(sequelize, DataTypes);
  var issues_labels = _issues_labels(sequelize, DataTypes);
  var label = _label(sequelize, DataTypes);
  var option = _option(sequelize, DataTypes);
  var pending_todo = _pending_todo(sequelize, DataTypes);
  var privilege = _privilege(sequelize, DataTypes);
  var project = _project(sequelize, DataTypes);
  var question = _question(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var roles_privileges = _roles_privileges(sequelize, DataTypes);
  var sprint = _sprint(sequelize, DataTypes);
  var team = _team(sequelize, DataTypes);
  var teams_labels = _teams_labels(sequelize, DataTypes);
  var teams_users = _teams_users(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var users_roles = _users_roles(sequelize, DataTypes);

  hindsight.belongsToMany(question, {
    as: "id_question_questions",
    through: hindsight_questions,
    foreignKey: "id_hindsight",
    otherKey: "id_question",
  });
  question.belongsToMany(hindsight, {
    as: "id_hindsight_hindsights",
    through: hindsight_questions,
    foreignKey: "id_question",
    otherKey: "id_hindsight",
  });
  hindsight_questions.belongsTo(hindsight, {
    as: "id_hindsight_hindsight",
    foreignKey: "id_hindsight",
  });
  hindsight.hasMany(hindsight_questions, {
    as: "hindsight_questions",
    foreignKey: "id_hindsight",
  });
  answer.belongsTo(hindsight_questions, {
    as: "id_hindsight_hindsight_question",
    foreignKey: "id_hindsight",
  });
  hindsight_questions.hasMany(answer, {
    as: "answers",
    foreignKey: "id_hindsight",
  });
  answer.belongsTo(hindsight_questions, {
    as: "id_question_hindsight_question",
    foreignKey: "id_question",
  });
  hindsight_questions.hasMany(answer, {
    as: "id_question_answers",
    foreignKey: "id_question",
  });
  issues_labels.belongsTo(issue, {
    as: "id_issue_issue",
    foreignKey: "id_issue",
  });
  issue.hasMany(issues_labels, { as: "issues_labels", foreignKey: "id_issue" });
  issues_labels.belongsTo(label, {
    as: "id_label_label",
    foreignKey: "id_label",
  });
  label.hasMany(issues_labels, { as: "issues_labels", foreignKey: "id_label" });
  teams_labels.belongsTo(label, {
    as: "id_label_label",
    foreignKey: "id_label",
  });
  label.hasMany(teams_labels, { as: "teams_labels", foreignKey: "id_label" });
  roles_privileges.belongsTo(privilege, {
    as: "id_privilege_privilege",
    foreignKey: "id_privilege",
  });
  privilege.hasMany(roles_privileges, {
    as: "roles_privileges",
    foreignKey: "id_privilege",
  });
  sprint.belongsTo(project, {
    as: "id_project_project",
    foreignKey: "id_project",
  });
  project.hasMany(sprint, { as: "sprints", foreignKey: "id_project" });
  hindsight_questions.belongsTo(question, {
    as: "id_question_question",
    foreignKey: "id_question",
  });
  question.hasMany(hindsight_questions, {
    as: "hindsight_questions",
    foreignKey: "id_question",
  });
  option.belongsTo(question, {
    as: "id_question_question",
    foreignKey: "id_question",
  });
  question.hasMany(option, { as: "options", foreignKey: "id_question" });
  roles_privileges.belongsTo(role, {
    as: "id_role_role",
    foreignKey: "id_role",
  });
  role.hasMany(roles_privileges, {
    as: "roles_privileges",
    foreignKey: "id_role",
  });
  users_roles.belongsTo(role, { as: "id_role_role", foreignKey: "id_role" });
  role.hasMany(users_roles, { as: "users_roles", foreignKey: "id_role" });
  hindsight.belongsTo(sprint, {
    as: "id_sprint_sprint",
    foreignKey: "id_sprint",
  });
  sprint.hasMany(hindsight, { as: "hindsights", foreignKey: "id_sprint" });
  issue.belongsTo(sprint, { as: "id_sprint_sprint", foreignKey: "id_sprint" });
  sprint.hasMany(issue, { as: "issues", foreignKey: "id_sprint" });
  hindsight.belongsTo(team, { as: "id_team_team", foreignKey: "id_team" });
  team.hasMany(hindsight, { as: "hindsights", foreignKey: "id_team" });
  teams_labels.belongsTo(team, { as: "id_team_team", foreignKey: "id_team" });
  team.hasMany(teams_labels, { as: "teams_labels", foreignKey: "id_team" });
  teams_users.belongsTo(team, { as: "id_team_team", foreignKey: "id_team" });
  team.hasMany(teams_users, { as: "teams_users", foreignKey: "id_team" });
  answer.belongsTo(user, { as: "id_user_user", foreignKey: "id_user" });
  user.hasMany(answer, { as: "answers", foreignKey: "id_user" });
  issue.belongsTo(user, {
    as: "id_user_asignee_user",
    foreignKey: "id_user_asignee",
  });
  user.hasMany(issue, { as: "issues", foreignKey: "id_user_asignee" });
  pending_todo.belongsTo(user, { as: "id_user_user", foreignKey: "id_user" });
  user.hasMany(pending_todo, { as: "pending_todos", foreignKey: "id_user" });
  teams_users.belongsTo(user, { as: "id_user_user", foreignKey: "id_user" });
  user.hasMany(teams_users, { as: "teams_users", foreignKey: "id_user" });
  users_roles.belongsTo(user, { as: "id_user_user", foreignKey: "id_user" });
  user.hasMany(users_roles, { as: "users_roles", foreignKey: "id_user" });

  return {
    answer,
    hindsight,
    hindsight_questions,
    issue,
    issues_labels,
    label,
    option,
    pending_todo,
    privilege,
    project,
    question,
    role,
    roles_privileges,
    sprint,
    team,
    teams_labels,
    teams_users,
    user,
    users_roles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
