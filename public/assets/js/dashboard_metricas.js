const states = ["To Do", "En curso", "Pull request", "QA", "Blocked", "Done"];
const colors = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
  "rgba(255, 159, 64, 0.6)",
];

let data_general = {
  label: "Total",
  data: states.map((_) => Math.ceil(Math.random() * 15)),
};

createFilteredChart("general-chart", "General", [data_general], states, true);

const epics_data = [
  { label: "Epic 1", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 2", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 3", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 4", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 5", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 6", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Epic 7", data: states.map((_) => Math.ceil(Math.random() * 15)) },
];
createFilteredChart("epics-chart", "Epics", epics_data, states, true);

const types_data = [
  { label: "Task", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  { label: "Bug", data: states.map((_) => Math.ceil(Math.random() * 15)) },
  {
    label: "User story",
    data: states.map((_) => Math.ceil(Math.random() * 15)),
  },
];
createFilteredChart("types-chart", "Types", types_data, states, true);

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
        label: variation,
        data: labels_data.map((row) => row.data[index]),
        backgroundColor: colors[index],
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
