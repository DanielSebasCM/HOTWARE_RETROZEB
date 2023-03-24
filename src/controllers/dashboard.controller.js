const Retrospective = require("../models/retrospective.model");

const states_colors = [
  { label: "To Do", color: "rgba(255, 99, 132, 0.6)" },
  { label: "En curso", color: "rgba(54, 162, 235, 0.6)" },
  { label: "Pull request", color: "rgba(255, 206, 86, 0.6)" },
  { label: "QA", color: "rgba(75, 192, 192, 0.6)" },
  { label: "Blocked", color: "rgba(153, 102, 255, 0.6)" },
  { label: "Done", color: "rgba(255, 159, 64, 0.6)" },
];
const states = ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"];
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
  } catch (error) {
    console.log(error);
    return res.status(500).send("Id de retrospectiva no válido");
  }

  const raw_data_general = await retrospective.getMetricsTotal();
  let data_general = {
    label: "Total",
    data: [],
  };
  states_colors.forEach((state) => {
    const state_data = raw_data_general.find((d) => d.state === state.label);
    if (state_data) {
      data_general.data.push(Number(state_data["Story Points"]));
    } else {
      data_general.data.push(0);
    }
  });

  const raw_data_epics = await retrospective.getMetricsEpics();
  const epics = new Set(raw_data_epics.map((d) => d.epic_name));

  let data_epics = [];
  epics.forEach((epic) => {
    let data = [];
    states_colors.forEach((state) => {
      const state_data = raw_data_epics.find((d) => {
        return d.state === state.label && d.epic_name === epic;
      });
      if (state_data) {
        data.push(Number(state_data["Story Points"]));
      } else {
        data.push(0);
      }
    });
    data_epics.push({ label: epic, data });
  });

  const raw_data_types = await retrospective.getMetricsTypes();
  const types = new Set(raw_data_types.map((d) => d.type));

  let data_types = [];
  types.forEach((type) => {
    let data = [];
    states_colors.forEach((state) => {
      const state_data = raw_data_types.find((d) => {
        return d.state === state.label && d.type === type;
      });
      if (state_data) {
        data.push(Number(state_data["Story Points"]));
      } else {
        data.push(0);
      }
    });
    data_types.push({ label: type, data });
  });

  res.render("dashboard_metrics", {
    title: "Dashboard Metricas",
    user: "Hotware",
    retrospective,
    states: states_colors,
    data_general,
    data_epics,
    data_types,
  });
};

module.exports = {
  renderDashboardMetrics: renderDashboardMetrics,
};
