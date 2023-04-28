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
const retroId = baseUrl[4];
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

// Generate Report
document
  .querySelector("#print--button")
  .addEventListener("click", async function () {
    // Clone the body and create a new one; Get Charts
    const previousBody = document.body.cloneNode(true);
    const canvas = document.querySelectorAll("canvas");
    const newBody = document.createElement("body");

    // Get the name of the retro, sprint and team
    const retroName = document.querySelector(".title").textContent;

    const url = window.location.href.split("/");
    url[url.length - 1] = "sprint";
    const sprint = await fetch(url.join("/")).then((res) => res.json());

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
    ).innerHTML = `Sprint: <span>${sprint.name}</span>`;
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

    let chart1 = Chart.getChart("general-chart");

    const data = chart1.data.datasets;
    let sp = "";
    data.forEach((obj, i, arr) => {
      if (i !== arr.length - 1)
        sp += `${obj.label}: <span>${
          obj.data[0] ? obj.data[0] : 0
        } sp /</span> `;
      else
        sp += `${obj.label}: <span>${obj.data[0] ? obj.data[0] : 0} sp</span> `;
    });
    newDiv.appendChild(document.createElement("h2")).innerHTML = sp;

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
      newBody.appendChild(document.createElement("br"));
      newBody.appendChild(document.createElement("br"));
      newBody.appendChild(document.createElement("hr"));

      newBody.appendChild(document.createElement("br"));
      newBody.appendChild(document.createElement("br"));
      newBody.appendChild(document.createElement("br"));
    }
    document.body = newBody;
    await new Promise((r) => setTimeout(r, 500));
    window.print();
    document.body = previousBody;
    location.reload();
  });

// Confirm closing retro modal
const modalButton = document.getElementById("modal-button");
const modalContainer = document.getElementById("modal-container");

modalButton.addEventListener("click", function () {
  modalContainer.style.display = "block";
});

modalContainer.addEventListener("click", function (event) {
  if (event.target === modalContainer) {
    modalContainer.style.display = "none";
  }
});

const modalContent = document.createElement("div");
modalContent.setAttribute("id", "modal-content");
modalContent.setAttribute("class", "modal-content");

modalContent.innerHTML = `
    <h2 class="title">¿Estás seguro de que quieres cerrar la retrospectiva?</h2>
    <form method="POST" action="/retrospectivas/${retroId}/cerrar?_method=PATCH" id="form">
      <div class="buttons-container">
        <button class="button button--delete-alt" type="submit">Sí</button>
        <a class="button button--discard" id="modal-close">No</a>
      </div>
    </form>
    `;
modalContainer.appendChild(modalContent);

// Agrega un evento de clic al botón de cerrar para ocultar el modal
const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", function () {
  modalContainer.style.display = "none";
});
function chartToCSV(chartId) {
  const chart = Chart.getChart(chartId);
  const { datasets, labels } = chart.data;
  const res = {};
  res.label = labels;
  datasets.forEach((dataset) => {
    res[dataset.label] = dataset.data;
  });
  console.log(res);

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
