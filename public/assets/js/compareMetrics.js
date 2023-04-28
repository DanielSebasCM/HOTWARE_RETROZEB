const currentUserUid = document.querySelector("#current-user").dataset.uid;
const teamOptions = document.getElementById("team-options");
const issuesOptions = document.getElementById("issues-options");
const labelOptions = document.getElementById("label-options");
const nRetrospectivesInput = document.getElementById("n_retrospectives");
const epicsOptions = document.getElementById("epics-options");
const stackedInput = document.getElementById("stacked");
const accumInput = document.getElementById("accum");
const tokens = getTokens();
const pruneEmpty = false;
const usersUids = {};
const statesColors = [
  { state: "To Do", color: "rgba(255, 140, 165, 1)" },
  { state: "En curso", color: "rgba(105, 195, 255, 1)" },
  { state: "Pull request", color: "rgba(255, 226, 154, 1)" },
  { state: "QA", color: "rgba(147, 217, 217, 1)" },
  { state: "Blocked", color: "rgba(194, 163, 255, 1)" },
  { state: "Done", color: "rgba(255, 197, 140, 1)" },
];

let selectedTeamId = teamOptions.value;
let selectedIssues = issuesOptions.value;
let selectedLabel = labelOptions.value;
let stacked = stackedInput.checked;
let accum = accumInput.checked;
let selectedEpics = epicsOptions.selectedOptions;
let nRetrospectives = nRetrospectivesInput.value;

Chart.defaults.font.family = "Poppins";
Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    const v = x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

issuesOptions.addEventListener("change", (e) => {
  selectedIssues = e.target.value;
  updateCharts();
});

// LABELS
labelOptions.addEventListener("change", (e) => {
  selectedLabel = e.target.value;
  updateCharts();
});

// INPUTS
nRetrospectivesInput.addEventListener("change", async (e) => {
  let n = parseInt(e.target.value);
  if (n > 10) {
    n = 10;
  } else if (n < 2) {
    n = 2;
  }
  window.location.href = `/retrospectivas/comparar/${n}`;
});

accumInput.addEventListener("change", (e) => {
  accum = e.target.checked;
  updateCharts();
});

stackedInput.addEventListener("change", (e) => {
  stacked = e.target.checked;
  updateCharts();
});

epicsOptions.addEventListener("change", (e) => {
  selectedEpics = epicsOptions.selectedOptions;
  const epicsData = groupFilterIssues(groupedIssues, "sprint_name", (i) =>
    filterIssuesEpics(i, selectedLabel, selectedIssues, selectedEpics)
  );
  updateChart("epics-chart", epicsData, sprints);
});

// CHARTS
const retrospectives = await fetch(
  `/equipos/${selectedTeamId}/retrospectivas/${nRetrospectives}`,
  {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + tokens.authToken,
    },
  }
).then((res) => res.json());

retrospectives.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

const retrospectivesUsers = await Promise.all(
  retrospectives.map((r) =>
    fetch(`/retrospectivas/${r.id}/usuarios`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tokens.authToken,
      },
    }).then((res) => res.json())
  )
);

for (let i = 0; i < retrospectives.length; i++) {
  const uids = retrospectivesUsers[i].map((u) => u.uid);
  usersUids[retrospectives[i].id] = uids;
}

let issues = await Promise.all(
  retrospectives.map(async (r) =>
    fetch(`/retrospectivas/${r.id}/issues`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tokens.authToken,
      },
    }).then((res) =>
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
  return r.sprint_name;
});

const dataGeneral = groupFilterIssues(groupedIssues, "sprint_name", (i) =>
  filterIssuesGeneral(i, selectedLabel, selectedIssues)
);
createChart("general-chart", "General", dataGeneral, sprints, "x");

const epicsData = groupFilterIssues(groupedIssues, "sprint_name", (i) =>
  filterIssuesEpics(i, selectedLabel, selectedIssues, selectedEpics)
);
createChart("epics-chart", "Epics", epicsData, sprints, "x");

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
  canvas.parentElement.style.height = "400px";

  labels = labels.map((l) => l || nullLabel);

  for (const state in statesData) {
    const data = statesData[state];
    if (data[null]) {
      data[nullLabel] = data[null];
      delete data[null];
    }
  }

  const datasets = statesColors.map(({ state, color }) => {
    const storyPoints = labels.map((l) => {
      if (statesData[state])
        return statesData[state][l] || (accum && stacked ? 0 : null);
      return null;
    });

    let bgColor = color.slice();
    // if (accum && stacked) bgColor = bgColor.slice(0, -4) + " 1)";
    return {
      label: `${state}`,
      data: storyPoints,
      backgroundColor: bgColor,
      fill: true,
      skipNull: true,
    };
  });

  if (accum) {
    datasets.forEach((d, i) => {
      if (d.label === "Done") {
        // if (true) {
        datasets[i].data.forEach((_, j) => {
          if (j > 0) datasets[i].data[j] += datasets[i].data[j - 1];
        });
      }
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

  let tooltip = undefined;

  if (!accum) {
    tooltip = {
      callbacks: {
        afterLabel: function (context) {
          return `${(
            (context.parsed[secundaryAxis] / totals[context.label]) *
            100
          ).toFixed(2)}%`;
        },
      },
    };
  }

  return new Chart(canvas, {
    type: accum && stacked ? "line" : "bar",
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
        tooltip,
      },
      scales: {
        [mainAxis]: {
          stacked,
          ticks: {
            autoSkip: false,
          },
        },
        [secundaryAxis]: {
          stacked,
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

function groupFilterIssues(rawData, key, filterFn) {
  const data = {};
  // Por cada valor del filtro crear un objeto con los issues correspondinetes
  for (const state in rawData) {
    const filteredData = rawData[state].filter(filterFn);
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

function filterIssuesGeneral(issue, labelFilter, issuesFilter) {
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

function filterIssuesEpics(issue, labelFilter, issuesFilter, epicFilters) {
  const passesGeneral = filterIssuesGeneral(issue, labelFilter, issuesFilter);
  return passesGeneral && epicFilters.includes(issue.epic_name);
}

function updateCharts() {
  const dataGeneral = groupFilterIssues(groupedIssues, "sprint_name", (i) =>
    filterIssuesGeneral(i, selectedLabel, selectedIssues)
  );
  updateChart("general-chart", dataGeneral, sprints);

  const epicsData = groupFilterIssues(groupedIssues, "sprint_name", (i) =>
    filterIssuesEpics(i, selectedLabel, selectedIssues, selectedEpics)
  );
  updateChart("epics-chart", epicsData, sprints);
}

function updateChart(canvasId, statesData, labels) {
  const chart = Chart.getChart(canvasId);
  const title = chart.options.plugins.title.text;
  const mainAxis = chart.options.indexAxis;
  chart.destroy();
  createChart(canvasId, title, statesData, labels, mainAxis);
}

// Report Generation

document
  .querySelector("#print--button")
  .addEventListener("click", async function () {
    // Clone the body and create a new one; Get Charts
    const previousBody = document.body.cloneNode(true);
    const canvas = document.querySelectorAll("canvas");
    const newBody = document.createElement("body");

    // Get the name of the retro, sprint and team
    const retroName = document.querySelector(".title").textContent;

    const teamName = document
      .querySelector("#issues-options option:nth-child(2)")
      .textContent.split(" ");
    teamName.shift();

    // Create div for headers
    newBody.appendChild(document.createElement("div")).style.display = "flex";
    const newDiv = newBody.querySelector("div");
    newDiv.style.alignItems = "center";
    newDiv.style.justifyContent = "center";
    newDiv.style.flexDirection = "column";
    newDiv.style.width = "100%";

    // Create headers
    newDiv.appendChild(
      document.createElement("h1")
    ).innerHTML = `Retrospectiva: <span>${retroName}</span>`;
    newDiv.appendChild(
      document.createElement("h1")
    ).innerHTML = `<span>Ultimos ${sprints.length} sprints comparados</span>`;
    newDiv.appendChild(
      document.createElement("h1")
    ).innerHTML = `Equipo: <span>${teamName.join(" ")}</span>`;
    newDiv.appendChild(document.createElement("div")).style.textAlign =
      "center";
    newDiv.appendChild(
      document.createElement("h2")
    ).innerHTML = `Labels: <span>${
      selectedLabel === "All" ? "Todos" : selectedLabel
    }</span>`;
    newDiv.appendChild(
      document.createElement("h2")
    ).innerHTML = `Issues: <span>${
      selectedIssues === "All"
        ? "Todos"
        : selectedIssues === "Personal"
        ? "Personales"
        : "De equipo"
    }</span>`;

    let epics = "";

    selectedEpics.forEach((epic, i, arr) => {
      if (i === arr.length - 1) epics += epic ? epic : "No épica";
      else epics += `${epic ? epic : "No épica"}, `;
    });

    newDiv.appendChild(
      document.createElement("h2")
    ).innerHTML = `Epics: <span>${epics}</span>`;

    newDiv.querySelectorAll("span").forEach((span) => {
      span.style.fontWeight = "normal";
    });
    newDiv
      .querySelectorAll("h2")
      .forEach((h2) => (h2.style.alignSelf = "flex-start"));
    newBody.appendChild(document.createElement("br"));
    newBody.appendChild(document.createElement("hr"));
    newBody.appendChild(document.createElement("br"));

    for (let node of canvas) {
      newBody.appendChild(node);
      newBody.appendChild(document.createElement("br"));
      newBody.appendChild(document.createElement("hr"));
      newBody.appendChild(document.createElement("br"));
    }
    document.body = newBody;
    await new Promise((r) => setTimeout(r, 500));
    window.print();
    document.body = previousBody;
    location.reload();
  });

function chartToCSV(chartId) {
  const chart = Chart.getChart(chartId);
  const { datasets, labels } = chart.data;
  const res = {};
  res.label = labels;
  datasets.forEach((dataset) => {
    res[dataset.label] = dataset.data;
  });

  return ConvertToCSV(res);
}

function ConvertToCSV(data) {
  const headers = Object.keys(data);
  const rows = Object.values(data);

  let csv = headers.join(",") + "\n";

  for (let i = 0; i < rows[0].length; i++) {
    let row = "";
    for (let j = 0; j < rows.length; j++) {
      if (j === rows.length - 1) row += rows[j][i];
      else row += rows[j][i] + ",";
    }
    csv += row + "\n";
  }

  return csv;
}

function download(chartId) {
  const data = chartToCSV(chartId);
  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `${chartId}.csv`);
  a.click();
}

document.querySelectorAll(".pill--late").forEach((pill) => {
  pill.addEventListener("click", function () {
    download(this.dataset.id);
  });
});
