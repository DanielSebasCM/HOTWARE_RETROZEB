Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    const v = x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

const statesColors = [
  { state: "To Do", color: "rgba(255, 99, 132, 0.6)" },
  { state: "En curso", color: "rgba(54, 162, 235, 0.6)" },
  { state: "Pull request", color: "rgba(255, 206, 86, 0.6)" },
  { state: "QA", color: "rgba(75, 192, 192, 0.6)" },
  { state: "Blocked", color: "rgba(153, 102, 255, 0.6)" },
  { state: "Done", color: "rgba(255, 159, 64, 0.6)" },
];

Chart.defaults.font.family = "Poppins";

const currentUserUid = document.querySelector("#current-user").dataset.uid;
const pruneEmpty = false;

let baseUrl = window.location.href.split("/");
baseUrl.pop();
baseUrl = baseUrl.join("/");

const issuesUrl = baseUrl + "/issues";
const usersUrl = baseUrl + "/usuarios";

const issuesData = await fetch(issuesUrl);
const issues = await issuesData.json();

const groupedIssues = issues.groupBy("state");

const usersData = await fetch(usersUrl);
const users = await usersData.json();
const usersUids = users.map((d) => d.uid);

const labelOptions = document.getElementById("label-options");
let selectedLabel = labelOptions.value;
labelOptions.onchange = function () {
  selectedLabel = this.value;
  updateCharts();
};

const issuesOptions = document.getElementById("issues-options");
let selectedIssues = issuesOptions.value;
issuesOptions.onchange = function () {
  selectedIssues = this.value;
  updateCharts();
};

const epics = [...new Set(issues.map((d) => d.epic_name))];
const types = [...new Set(issues.map((d) => d.type))];

const dataGeneral = groupFilterIssues(groupedIssues, null);
createChart("general-chart", "General", dataGeneral, ["Total"], "y");

const dataEpics = groupFilterIssues(groupedIssues, "epic_name");
const epicChart = createChart("epics-chart", "Epics", dataEpics, epics, "y");
//get chart labels
const epicLabels = epicChart.data.labels;
console.log(epicLabels);

const dataTypes = groupFilterIssues(groupedIssues, "type");
createChart("types-chart", "Types", dataTypes, types, "y");

function createChart(canvasId, title, statesData, labels, mainAxis = "x") {
  const secundaryAxis = mainAxis === "x" ? "y" : "x";

  const canvas = document.getElementById(canvasId);
  canvas.parentElement.style.height = `${labels.length * 25 + 150}px`;

  const labelHasData = {};

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((l) => {
      if (statesData[state]) {
        const data = statesData[state][l] || 0;
        labelHasData[l] = labelHasData[l] || data > 0;
        return data;
      }
      return 0;
    });
    return {
      label: `${state}`,
      data: storyPoints,
      backgroundColor: color,
    };
  });

  const totals = {};
  labels.forEach((l) => {
    totals[l] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  if (pruneEmpty) {
    labels = labels.filter((l) => {
      const res = labelHasData[l];
      if (!res) datasets.forEach((d) => d.data.splice(labels.indexOf(l), 1));
      return res;
    });
  }

  labels = labels.map((l) => l || "N/A");

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets,
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
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            afterLabel: function (context) {
              return `${(
                (context.parsed[secundaryAxis] / totals[context.label]) *
                100
              ).toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        [mainAxis]: {
          stacked: true,
          ticks: {
            autoSkip: false,
          },
        },
        [secundaryAxis]: {
          stacked: true,
          title: {
            display: true,
            text: "Story points",
          },
          ticks: {
            autoSkip: false,
          },
        },
      },
    },
  });
}

function groupFilterIssues(rawData, key) {
  const data = {};
  // Por cada valor del filtro crear un objeto con los issues correspondinetes
  for (const state in rawData) {
    const filteredData = rawData[state].filter((i) =>
      filterIssues(i, selectedLabel, selectedIssues)
    );
    if (filteredData.length === 0) continue;

    const groupedFilteredData = key
      ? filteredData.groupBy(key)
      : { Total: filteredData };

    let totalStoryPoints = {};
    for (const k in groupedFilteredData) {
      totalStoryPoints[k] = groupedFilteredData[k]
        .map((d) => d.story_points)
        .reduce((a, b) => a + b, 0);
    }

    data[state] = totalStoryPoints;
  }
  return data;
}

function filterIssues(issue, labelFilter, issuesFilter) {
  // Filter by label
  let hasLabel;
  switch (labelFilter) {
    case "All":
      hasLabel = true;
      break;
    case "None":
      hasLabel = issue.labels.length === 0;
      break;
    default:
      hasLabel = issue.labels.includes(selectedLabel);
  }
  //filter by issue_option
  let hasCorrectUser;
  switch (issuesFilter) {
    case "All":
      hasCorrectUser = true;
      break;
    case "Personal":
      hasCorrectUser = issue.uid == currentUserUid;
      break;
    default:
      hasCorrectUser = usersUids.includes(issue.uid);
      break;
  }

  return hasLabel && hasCorrectUser;
}

function updateCharts() {
  const dataGeneral = groupFilterIssues(groupedIssues, null);
  updateChart("general-chart", dataGeneral, ["Total"]);

  const dataEpics = groupFilterIssues(groupedIssues, "epic_name");
  updateChart("epics-chart", dataEpics, epics);

  const dataTypes = groupFilterIssues(groupedIssues, "type");
  updateChart("types-chart", dataTypes, types);
}

function updateChart(canvasId, statesData, labels) {
  const chart = Chart.getChart(canvasId);

  const secundaryAxis = chart.options.indexAxis === "y" ? "x" : "y";

  //Set the label "N/A" to null
  const labelHasData = {};

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((l) => {
      if (statesData[state]) {
        const data = statesData[state][l] || 0;
        labelHasData[l] = labelHasData[l] || data > 0;
        return data;
      }
      return 0;
    });
    return {
      label: `${state}`,
      data: storyPoints,
      backgroundColor: color,
    };
  });

  const totals = {};
  labels.forEach((l) => {
    totals[l] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  if (pruneEmpty) {
    labels = labels.filter((l) => {
      const res = labelHasData[l];
      if (!res) datasets.forEach((d) => d.data.splice(labels.indexOf(l), 1));
      return res;
    });
  }

  labels = labels.map((l) => l || "N/A");

  chart.data.labels = labels;
  chart.data.datasets = datasets;

  chart.options.plugins.tooltip.callbacks.afterLabel = function (context) {
    return `${context.parsed[secundaryAxis].toFixed(2)} story points\n${(
      (context.parsed[secundaryAxis] / totals[context.label]) *
      100
    ).toFixed(2)}%`;
  };
  chart.update();
}
