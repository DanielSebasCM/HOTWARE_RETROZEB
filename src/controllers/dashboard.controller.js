const Retrospective = require("../models/retrospective.model");

const states = [
  { label: "To Do", color: "rgba(255, 99, 132, 0.6)" },
  { label: "En curso", color: "rgba(54, 162, 235, 0.6)" },
  { label: "Pull request", color: "rgba(255, 206, 86, 0.6)" },
  { label: "QA", color: "rgba(75, 192, 192, 0.6)" },
  { label: "Blocked", color: "rgba(153, 102, 255, 0.6)" },
  { label: "Done", color: "rgba(255, 159, 64, 0.6)" },
];
// const states = ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"];
// const colors = [
//   "rgba(255, 99, 132, 0.6)",
//   "rgba(54, 162, 235, 0.6)",
//   "rgba(255, 206, 86, 0.6)",
//   "rgba(75, 192, 192, 0.6)",
//   "rgba(153, 102, 255, 0.6)",
//   "rgba(255, 159, 64, 0.6)",
// ];

const renderDashboardMetrics = async (req, res) => {
  const id_retrospective = req.params.id;
  let retrospective;
  try {
    retrospective = await Retrospective.getById(id_retrospective);
    const issues = await retrospective.getIssues();

    const labels = [...new Set(issues.map((d) => d.labels).flat())];
    console.log(labels);
    res.render("dashboard_metrics", {
      title: "Dashboard Metricas",
      user: "Hotware",
      retrospective,
      states,
      issues,
      labels,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Id de retrospectiva no válido");
  }
};

module.exports = {
  renderDashboardMetrics: renderDashboardMetrics,
};
