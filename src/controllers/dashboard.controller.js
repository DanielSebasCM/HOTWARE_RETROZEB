const { routes } = require("../utils/constants");
const {
  fetchProjectJiraLatestSprint,
  fetchSprintIssues,
  getJiraActionables,
} = require("../utils/jira");
const Retrospective = require("../models/retrospective.model");
const User = require("../models/user.model");
const Team = require("../models/team.model");
const renderDashboard = async (req, res, next) => {
  try {
    const sprint = await fetchProjectJiraLatestSprint(
      process.env.ZECOMMERCE_PROJECT_ID,
      "active"
    );
    const retrospectives = await Retrospective.getAllByState("IN_PROGRESS");
    const answerableRetrospectives = retrospectives.filter(
      async (retrospective) => {
        const users = await retrospective.getUsers();
        return users.some((user) => user.uid === req.session.currentUser.uid);
      }
    );

    const actionables = await getJiraActionables();
    const ownActionables = actionables.filter(
      (actionable) => actionable.id_user_author === req.session.currentUser.uid
    );

    let team = null;
    if (req.session.selectedTeam) {
      team = await Team.getById(req.session.selectedTeam.id);
    }
    const labelsSet = new Set();

    res.render("dashboard", {
      title: "Dashboard",
      sprint,
      answerableRetrospectives,
      ownActionables,
      team,
    });
  } catch (err) {
    next(err);
  }
};

const getIssues = async (req, res, next) => {
  try {
    const sprint = await fetchProjectJiraLatestSprint(
      process.env.ZECOMMERCE_PROJECT_ID,
      "active"
    );
    const issues = await fetchSprintIssues(sprint.id_jira);
    res.status(200).json(issues);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const team = await Team.getById(req.session.selectedTeam.id);
    const users = await team.getMembers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { renderDashboard, getIssues, getUsers };
