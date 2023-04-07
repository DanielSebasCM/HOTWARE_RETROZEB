Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    const v = x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

const pruneEmpty = false;
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

const stackedInput = document.getElementById("stacked");
let stacked = stackedInput.checked;
console.log(stacked);
stackedInput.addEventListener("change", (e) => {
  stacked = e.target.checked;
  console.log(stacked);
  updateCharts();
});

// CHARTS
const retrospectives = await fetch(
  `/equipos/${selectedTeamId}/retrospectivas/${nRetrospectives}`
).then((res) => res.json());

retrospectives.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

const usersUids = {};
const retrospectivesUsers = await Promise.all(
  retrospectives.map((r) =>
    fetch(`/retrospectivas/${r.id}/usuarios`).then((res) => res.json())
  )
);

for (let i = 0; i < retrospectives.length; i++) {
  const uids = retrospectivesUsers[i].map((u) => u.uid);
  usersUids[retrospectives[i].id] = uids;
}

let issues = await Promise.all(
  retrospectives.map(async (r) =>
    fetch(`/retrospectivas/${r.id}/issues`).then((res) =>
      res.json().then((d) => {
        d.forEach((i) => {
          i.id_retrospective = r.id;
        });
        return d;
      })
    )
  )
);

issues = issues.flat();

const groupedIssues = issues.groupBy("state");

const sprints = retrospectives.map((r) => {
  return r.id_sprint;
});

const dataGeneral = groupFilterIssues(groupedIssues, "id_sprint");
createChart("general-chart", "General", dataGeneral, sprints, "x");

function createChart(canvasId, title, statesData, labels, mainAxis = "x") {
  const secundaryAxis = mainAxis === "x" ? "y" : "x";

  const canvas = document.getElementById(canvasId);
  // canvas.parentElement.style.height = "500px";

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((l) => {
      if (statesData[state]) return statesData[state][l] || 0;
      return 0;
    });
    return {
      label: `${state}`,
      data: storyPoints,
      backgroundColor: color,
      fill: true,
    };
  });

  if (stacked) {
    datasets.forEach((d, i) => {
      if (d.label === "Done") {
        // if (true) {
        datasets[i].data.forEach((_, j) => {
          if (j > 0) datasets[i].data[j] += datasets[i].data[j - 1];
        });
      }
      console.log(d);
    });
  }
  console.log(labels);
  console.log(datasets);

  const totals = {};
  labels.forEach((l) => {
    totals[l] = statesColors.reduce((acc, { state }) => {
      const data = statesData[state];
      if (data) return acc + (data[l] || 0);
      return acc;
    }, 0);
  });

  labels = labels.map((l) => l || "N/A");

  return new Chart(canvas, {
    type: stacked ? "line" : "bar",
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
      hasCorrectUser = usersUids[issue.id_retrospective].includes(issue.uid);
      break;
  }

  return hasLabel && hasCorrectUser;
}

function updateCharts() {
  const dataGeneral = groupFilterIssues(groupedIssues, "id_sprint");
  updateChart("general-chart", dataGeneral, sprints);
}

function updateChart(canvasId, statesData, labels) {
  const chart = Chart.getChart(canvasId);
  const title = chart.options.plugins.title.text;
  const mainAxis = chart.options.indexAxis;
  chart.destroy();
  createChart(canvasId, title, statesData, labels, mainAxis);
}
