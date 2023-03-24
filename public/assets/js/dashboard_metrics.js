let groupedByState = {};

states.forEach((state) => {
  let state_data = issues.filter((d) => d.state === state.label);
  groupedByState[state.label] = state_data;
});

console.log(groupedByState);

let data_general = {
  label: "General",
  data: [],
};

states.forEach((state) => {
  const state_data = groupedByState[state.label]
    .map((d) => d.story_points)
    .reduce((a, b) => a + b, 0);

  if (state_data) {
    data_general.data.push(state_data);
  } else {
    data_general.data.push(0);
  }
});
createFilteredChart("general-chart", "General", [data_general], states, true);

const epics = [...new Set(issues.map((d) => d.epic_name))];
const data_epics = parseGroupedIssues(groupedByState, "epic_name", epics);
createFilteredChart("epics-chart", "Epics", data_epics, states, true);

const types = [...new Set(issues.map((d) => d.type))];
console.log(types);
const data_types = parseGroupedIssues(groupedByState, "type", types);
createFilteredChart("types-chart", "Types", data_types, states, true);

const priorities = ["Lowest", "Low", "Medium", "High", "Highest"];
const data_priorities = parseGroupedIssues(
  groupedByState,
  "priority",
  priorities
);
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
          max: max_data,
        },
        [mainAxis]: {
          stacked: true,
        },
      },
    },
  });
}

function parseGroupedIssues(rawData, filter, filterValues, nullLabel) {
  const data = [];
  filterValues.forEach((filterValue) => {
    let filterData = [];
    states.forEach((state) => {
      let stateData = rawData[state.label]
        .filter((d) => d[filter] === filterValue)
        .map((d) => d.story_points)
        .reduce((a, b) => a + b, 0);
      if (stateData) {
        filterData.push(stateData);
      } else {
        filterData.push(0);
      }
    });
    if (filterValue === null) {
      filterValue = nullLabel || "N/A";
    }
    data.push({
      label: filterValue,
      data: filterData,
    });
  });
  return data;
}
