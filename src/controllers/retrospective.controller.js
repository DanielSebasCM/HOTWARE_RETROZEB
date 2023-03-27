const Retrospective = require("../models/retrospective.model");

const getRetrospectiveDashboard = async (req, res) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const labels = await retrospective.getLabels();
    res.render("retrospectiveDashboard", {
      title: "Dashboard",
      retrospective,
      labels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500/index", { title: "500" });
  }
};

const getLiveSprintIssues = async (req, res) => {};

const getRetrospectiveIssues = async (req, res) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const issues = await retrospective.getIssues();
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).render("500/index", { title: "500" });
  }
};

module.exports = {
  getRetrospectiveDashboard,
  getRetrospectiveIssues,
};
