const { routes } = require("../utils/constants");
const {
  fetchProjectJiraLatestSprint,
  fetchSprintIssues,
} = require("../utils/jira");

const renderDashboard = async (req, res, next) => {
  try {
    const sprint = await fetchProjectJiraLatestSprint(
      process.env.ZECOMMERCE_PROJECT_ID,
      "active"
    );
    res.render("dashboard", {
      title: "Dashboard",
      sprint,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { renderDashboard };
