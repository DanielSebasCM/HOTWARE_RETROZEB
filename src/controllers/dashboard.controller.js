const Retrospective = require("../models/retrospective.model");

const states_colors = [
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
  } catch (error) {
    console.log(error);
    return res.status(500).send("Id de retrospectiva no válido");
  }

  // General metrics
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

  // Epics metrics
  const raw_data_epics = await retrospective.getMetricsEpics();
  const epics = new Set(raw_data_epics.map((d) => d.epic_name));
  epics.add(null);
  const data_epics = parseGroupedIssues(raw_data_epics, "epic_name", epics);
  // replace null with "Sin epic"
  data_epics.forEach((epic) => {
    if (epic.label === null) {
      epic.label = "Sin epic";
    }
  });

  // Types metrics
  const rawDataTypes = await retrospective.getMetricsTypes();
  const types = new Set(rawDataTypes.map((d) => d.type));
  const data_types = parseGroupedIssues(rawDataTypes, "type", types);

  // Priorities metrics
  const rawDataPriorities = await retrospective.getMetricsPriorities();
  const priorities = ["Lowest", "Low", "Medium", "High", "Highest"];
  const data_priorities = parseGroupedIssues(
    rawDataPriorities,
    "priority",
    priorities
  );

  res.render("dashboard_metrics", {
    title: "Dashboard Metricas",
    user: "Hotware",
    retrospective,
    states: states_colors,
    data_general,
    data_epics,
    data_types,
    data_priorities,
  });
};

module.exports = {
  renderDashboardMetrics: renderDashboardMetrics,
};

function parseGroupedIssues(rawData, filter, filterValues) {
  const data = [];
  filterValues.forEach((filterValue) => {
    let filterData = [];
    states_colors.forEach((state) => {
      const state_data = rawData.find((d) => {
        return d.state === state.label && d[filter] === filterValue;
      });
      if (state_data) {
        filterData.push(Number(state_data["Story Points"]));
      } else {
        filterData.push(0);
      }
    });
    data.push({ label: filterValue, data: filterData });
  });
  return data;
}
