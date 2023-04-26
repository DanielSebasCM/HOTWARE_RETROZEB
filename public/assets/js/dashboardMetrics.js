const currentUserUid = document.querySelector("#current-user").dataset.uid;
const labelOptions = document.getElementById("label-options");
const issuesOptions = document.getElementById("issues-options");
const showEmptyInput = document.getElementById("show-empty");
const tokens = getTokens();
const statesColors = [
  { state: "To Do", color: "rgba(255, 140, 165, 1)" },
  { state: "En curso", color: "rgba(105, 195, 255, 1)" },
  { state: "Pull request", color: "rgba(255, 226, 154, 1)" },
  { state: "QA", color: "rgba(147, 217, 217, 1)" },
  { state: "Blocked", color: "rgba(194, 163, 255, 1)" },
  { state: "Done", color: "rgba(255, 197, 140, 1)" },
];

Chart.defaults.font.family = "Poppins";
Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    const v = x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

let selectedLabel = labelOptions.value;
let selectedIssues = issuesOptions.value;
let showEmpty = showEmptyInput.checked;
let baseUrl = window.location.href.split("/");
baseUrl.pop();
baseUrl = baseUrl.join("/");

const { issues, groupedIssues } = await getIssues();
const { usersUids } = await getUsers();

labelOptions.addEventListener("change", (e) => {
  selectedLabel = e.target.value;
  updateCharts();
});

issuesOptions.addEventListener("change", (e) => {
  selectedIssues = e.target.value;
  updateCharts();
});

showEmptyInput.addEventListener("change", (e) => {
  showEmpty = e.target.checked;
  updateCharts();
});

const epics = [...new Set(issues.map((d) => d.epic_name))];
const types = [...new Set(issues.map((d) => d.type))];

const dataGeneral = groupFilterIssues(groupedIssues, null);
createChart("general-chart", "General", dataGeneral, ["Total"], "y");

const dataEpics = groupFilterIssues(groupedIssues, "epic_name");
const epicChart = createChart(
  "epics-chart",
  "Epics",
  dataEpics,
  epics,
  "y",
  "Sin Epica"
);

//get chart labels
const epicLabels = epicChart.data.labels;

const dataTypes = groupFilterIssues(groupedIssues, "type");
createChart("types-chart", "Types", dataTypes, types, "y");

// FUNCTIONS
function createChart(
  canvasId,
  title,
  statesData,
  labels,
  mainAxis = "x",
  nullLabel = "N/A"
) {
  const secundaryAxis = mainAxis === "x" ? "y" : "x";

  const canvas = document.getElementById(canvasId);
  canvas.parentElement.style.height = `${labels.length * 15 + 150}px`;

  labels = labels.map((l) => l || nullLabel);

  for (const state in statesData) {
    const data = statesData[state];
    if (data[null]) {
      data[nullLabel] = data[null];
      delete data[null];
    }
  }

  const labelHasData = Array(labels.length).fill(false);

  let datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((label, index) => {
      if (statesData[state]) {
        const data = statesData[state][label] || 0;
        labelHasData[index] = labelHasData[index] || data > 0;
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

  if (!showEmpty) {
    labels = labels.filter((_, i) => labelHasData[i]);
    datasets.forEach((d) => {
      d.data = d.data.filter((_, i) => labelHasData[i]);
    });
  }

  const totals = {};
  labels.forEach((l) => {
    totals[l] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

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

    let groupedFilteredData = key
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
  console.log(data);
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
  const labelHasData = Array(labels.length).fill(false);

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((label, index) => {
      if (statesData[state]) {
        const data = statesData[state][label] || 0;
        labelHasData[index] = labelHasData[index] || data > 0;
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

  if (!showEmpty) {
    labels = labels.filter((_, i) => labelHasData[i]);
    datasets.forEach((d) => {
      d.data = d.data.filter((_, i) => labelHasData[i]);
    });
  }

  const totals = {};
  console.log(labels);
  labels.forEach((l) => {
    totals[l || "N/A"] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  console.log(totals);
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

async function getIssues() {
  const issuesUrl = baseUrl + "/issues";

  try {
    const issuesData = await fetch(issuesUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tokens.authToken,
      },
    });
    const issues = await issuesData.json();
    const groupedIssues = issues.groupBy("state");

    return { issues, groupedIssues };
  } catch (error) {
    console.log(error);
  }
}

async function getUsers() {
  const usersUrl = baseUrl + "/usuarios";

  try {
    const usersData = await fetch(usersUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tokens.authToken,
      },
    });

    const users = await usersData.json();
    const usersUids = users.map((d) => d.uid);

    return { users, usersUids };
  } catch (error) {
    console.log(error);
  }
}
