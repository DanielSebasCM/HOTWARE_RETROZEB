Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    const v = x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

// CONSTANTS and CONFIGS
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
const retrospective_names = document.getElementById("retrospectives_names");

// SELECTORS
// TEAMS
const teamOptions = document.getElementById("team-options");
let selectedTeamId = teamOptions.value;
// ISSUES
const issuesOptions = document.getElementById("issues-options");
let selectedIssues = issuesOptions.value;
issuesOptions.onchange = function () {
  selectedIssues = this.value;
  updateCharts();
};
// LABELS
const labelOptions = document.getElementById("label-options");
let selectedLabel = labelOptions.value;
labelOptions.onchange = function () {
  selectedLabel = this.value;
  updateCharts();
};

// INPUTS
const nRetrospectivesInput = document.getElementById("n_retrospectives");
let nRetrospectives = nRetrospectivesInput.value;
nRetrospectivesInput.addEventListener("change", async (e) => {
  let n = parseInt(e.target.value);
  if (n > 10) {
    n = 10;
  } else if (n < 1) {
    n = 1;
  }
  window.location.href = `/retrospectivas/comparar/${n}`;
});

// CHARTS
const retrospectivesData = await fetch(
  `/equipos/${selectedTeamId}/retrospectivas/${nRetrospectives}`
);
const retrospectives = await retrospectivesData.json();

const usersUids = {};
for (let retrospective of retrospectives) {
  const usersData = await fetch(`/retrospectivas/${retrospective.id}/usuarios`);
  const users = await usersData.json();
  const uids = users.map((u) => u.uid);
  usersUids[retrospective.id] = uids;
}

const issues = [];
for (let retrospective of retrospectives) {
  const issuesData = await fetch(`/retrospectivas/${retrospective.id}/issues`);
  const newIssues = await issuesData.json();
  newIssues.forEach((issue) => {
    issue.id_retrospective = retrospective.id;
    issues.push(issue);
  });
}

const groupedIssues = issues.groupBy("state");
const dataGeneral = groupFilterIssues(groupedIssues, "id_sprint");
const sprints = [...new Set(issues.map((d) => d.id_sprint))];
createChart("general-chart", "General", dataGeneral, sprints, "x");

function createChart(canvasId, title, statesData, labels, mainAxis = "x") {
  const secundaryAxis = mainAxis === "x" ? "y" : "x";

  const canvas = document.getElementById(canvasId);
  canvas.parentElement.style.height = `${statesData.length * 30 + 150}px`;

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((l) => {
      const data = statesData[state];
      if (data) return data[l] || 0;
      return 0;
    });
    return {
      label: `${state}`,
      data: storyPoints,

      backgroundColor: color,
      fill: true,
    };
  });

  //the same but accumulative

  const totals = {};
  labels.forEach((l) => {
    totals[l || "N/A"] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  labels = labels.map((l) => (l ? l : "N/A"));

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
            label: function (context) {
              return context.dataset.label;
            },
            afterLabel: function (context) {
              return `${context.parsed[secundaryAxis].toFixed(
                2
              )} story points\n${(
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
        },
        [secundaryAxis]: {
          stacked: true,
          title: {
            display: true,
            text: "Story points",
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
      hasCorrectUser = usersUids[issue.id_retrospective].includes(issue.uid);
      break;
  }

  return hasLabel && hasCorrectUser;
}

async function updateCharts() {
  const dataGeneral = groupFilterIssues(groupedIssues, "id_sprint");
  updateChart("general-chart", dataGeneral);
}

function updateChart(canvasId, statesData) {
  const chart = Chart.getChart(canvasId);

  const secundaryAxis = chart.options.indexAxis === "y" ? "x" : "y";

  let labels = chart.data.labels;
  //Set the label "N/A" to null
  labels = labels.map((l) => (l === "N/A" ? null : l));

  const totals = {};
  labels.forEach((l) => {
    totals[l || "N/A"] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  chart.data.datasets.forEach((dataset) => {
    const state = dataset.label;
    dataset.data = labels.map((l) => {
      const data = statesData[state];
      if (data) return data[l] || 0;
      return 0;
    });
  });

  chart.options.plugins.tooltip.callbacks.afterLabel = function (context) {
    return `${context.parsed[secundaryAxis].toFixed(2)} story points\n${(
      (context.parsed[secundaryAxis] / totals[context.label]) *
      100
    ).toFixed(2)}%`;
  };
  chart.update();
}
