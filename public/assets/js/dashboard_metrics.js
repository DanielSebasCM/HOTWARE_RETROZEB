let groupedByState = {};
states.forEach((state) => {
  let state_data = issues.filter((d) => d.state === state.label);
  groupedByState[state.label] = state_data;
});
console.log(groupedByState);

const label_select = document.getElementById("label-select");
let selected_label = label_select.value;

label_select.onchange = function () {
  selected_label = this.value;
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
          // suggestedMax: max_data,
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
  chart.data.datasets.forEach((dataset, index) => {
    dataset.data = labels_data.map((row) => row.data[index]);
  });
  // update tooltip percentage
  const totals = {};
  labels_data.forEach((row) => {
    totals[row.label] = row.data.reduce((a, b) => a + b, 0);
  });
  chart.options.plugins.tooltip.callbacks.afterLabel = function (context) {
    let axis = context.chart.options.indexAxis === "y" ? "x" : "y";
    return (
      context.parsed[axis].toFixed(2) +
      " story points" +
      "\n" +
      ((context.parsed[axis] / totals[context.label]) * 100).toFixed(2) +
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
