const states = [
  { label: "To Do", color: "rgba(255, 99, 132, 0.6)" },
  { label: "En curso", color: "rgba(54, 162, 235, 0.6)" },
  { label: "Pull request", color: "rgba(255, 206, 86, 0.6)" },
  { label: "QA", color: "rgba(75, 192, 192, 0.6)" },
  { label: "Blocked", color: "rgba(153, 102, 255, 0.6)" },
  { label: "Done", color: "rgba(255, 159, 64, 0.6)" },
];

const data = await fetch("/retrospectiva/1/issues");
const issues = await data.json();

let groupedByState = {};
states.forEach((state) => {
  let state_data = issues.filter((d) => d.state === state.label);
  groupedByState[state.label] = state_data;
});

const label_options = document.getElementById("label-options");
let selected_label = label_options.value;

label_options.onchange = function () {
  selected_label = this.value;
  updateCharts();
};

const team_options = document.getElementById("team-options");
let selected_team = team_options.value;
team_options.onchange = function () {
  selected_team = this.value;
  updateCharts();
};

const data_general = filterIssues(groupedByState);
data_general[0].label = "Total";
createFilteredChart("general-chart", "General", data_general, states, true);

const epics = [...new Set(issues.map((d) => d.epic_name))];
const data_epics = filterIssues(groupedByState, "epic_name", epics);
createFilteredChart("epics-chart", "Epics", data_epics, states, true);

const types = [...new Set(issues.map((d) => d.type))];
const data_types = filterIssues(groupedByState, "type", types);
createFilteredChart("types-chart", "Types", data_types, states, true);

const priorities = ["Lowest", "Low", "Medium", "High", "Highest"];
const data_priorities = filterIssues(groupedByState, "priority", priorities);
createFilteredChart(
  "priorities-chart",
  "Priorities",
  data_priorities,
  states,
  true
);

function createFilteredChart(
  canvasId,
  title,
  labels_data,
  variations,
  vertical
) {
  if (labels_data.some((row) => row.data.length !== variations.length)) {
    throw new Error("Data length must be equal to variations length");
  }

  const mainAxis = vertical ? "y" : "x";
  const secundaryAxis = vertical ? "x" : "y";

  const totals = {};
  labels_data.forEach((row) => {
    totals[row.label] = row.data.reduce((a, b) => a + b, 0);
  });

  const max_data = Math.max(...Object.values(totals));

  const canvas = document.getElementById(canvasId);
  canvas.parentElement.style.height = `${labels_data.length * 30 + 150}px`;

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels_data.map((row) => row.label),
      datasets: variations.map((variation, index) => ({
        label: variation.label,
        data: labels_data.map((row) => row.data[index]),
        backgroundColor: variation.color,
      })),
    },
    options: {
      indexAxis: mainAxis,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label;
            },
            afterLabel: function (context) {
              let axis = context.chart.options.indexAxis === "y" ? "x" : "y";
              return (
                context.parsed[axis].toFixed(2) +
                " story points" +
                "\n" +
                ((context.parsed[axis] / totals[context.label]) * 100).toFixed(
                  2
                ) +
                "%"
              );
            },
          },
        },
      },
      scales: {
        [secundaryAxis]: {
          stacked: true,
          title: {
            display: true,
            text: "Story points",
          },
          // max: max_data,
        },
        [mainAxis]: {
          stacked: true,
        },
      },
    },
  });
}

function updateCharts() {
  const data_general = filterIssues(groupedByState);
  data_general[0].label = "Total";
  updateFilteredChart("general-chart", data_general);

  const epics = [...new Set(issues.map((d) => d.epic_name))];
  const data_epics = filterIssues(groupedByState, "epic_name", epics);
  updateFilteredChart("epics-chart", data_epics);

  const types = [...new Set(issues.map((d) => d.type))];
  const data_types = filterIssues(groupedByState, "type", types);
  updateFilteredChart("types-chart", data_types);

  const priorities = ["Lowest", "Low", "Medium", "High", "Highest"];
  const data_priorities = filterIssues(groupedByState, "priority", priorities);
  updateFilteredChart("priorities-chart", data_priorities);
}

function updateFilteredChart(canvasId, labels_data) {
  const chart = Chart.getChart(canvasId);

  const mainAxis = chart.options.indexAxis === "y" ? "x" : "y";
  const secundaryAxis = chart.options.indexAxis === "y" ? "x" : "y";

  const totals = {};
  labels_data.forEach((row) => {
    totals[row.label] = row.data.reduce((a, b) => a + b, 0);
  });

  chart.data.datasets.forEach((dataset, index) => {
    dataset.data = labels_data.map((row) => row.data[index]);
  });

  chart.options.plugins.tooltip.callbacks.afterLabel = function (context) {
    return (
      context.parsed[mainAxis].toFixed(2) +
      " story points" +
      "\n" +
      ((context.parsed[mainAxis] / totals[context.label]) * 100).toFixed(2) +
      "%"
    );
  };
  chart.update();
}

function filterIssues(rawData, filter, filterValues) {
  const data = [];
  filterValues = filterValues || [undefined];
  filterValues.forEach((filterValue) => {
    let filterData = [];
    states.forEach((state) => {
      let stateData = rawData[state.label].filter(
        (d) => d[filter] === filterValue
      );

      if (selected_label === "Sin Label") {
        stateData = stateData.filter(
          (d) => d.labels === undefined || d.labels.length === 0
        );
      } else if (selected_label !== "Todos") {
        stateData = stateData.filter((d) => d.labels.includes(selected_label));
      }

      stateData = stateData
        .map((d) => d.story_points)
        .reduce((a, b) => a + b, 0);

      if (stateData) {
        filterData.push(stateData);
      } else {
        filterData.push(0);
      }
    });
    if (!filterValue) {
      filterValue = "N/A";
    }
    data.push({
      label: filterValue,
      data: filterData,
    });
  });
  return data;
}
