const canvas = document.getElementById("data-chart");
const canvas2 = document.getElementById("data-chart-line");
const canvas3 = document.getElementById("data-stacked");

const data = {
  label: "Story Points by Epic",
  data: [
    { label: "Epic 1", value: 10 },
    { label: "Epic 2", value: 20 },
    { label: "Epic 3", value: 15 },
    { label: "Epic 4", value: 25 },
    { label: "Epic 5", value: 22 },
    { label: "Epic 6", value: 30 },
    { label: "Epic 7", value: 28 },
  ],
};

const stackedData = {
  labels: ["Epic 1", "Epic 2", "Epic 3", "Epic 4"], // responsible for how many bars are gonna show on the chart
  // create 12 datasets, since we have 12 items
  // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
  // put 0, if there is no data for the particular bar
  datasets: [
    {
      label: "Label 1",
      data: [10, 20, 15, 25],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
    {
      label: "Label 2",
      data: [5, 10, 5, 10],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "Label 3",
      data: [0, 10, 0, 3],
      backgroundColor: "rgba(255, 206, 86, 0.6)",
    },
    {
      label: "Label 4",
      data: [0, 0, 5, 7],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
    {
      label: "Label 5",
      data: [3, 4, 0, 5],
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    },
    {
      label: "Label 6",
      data: [9, 4, 6, 2],
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    },
    {
      label: "Label 7",
      data: [5, 5, 5, 5],
      backgroundColor: "rgba(180, 180, 132, 0.6)",
    },
  ],
};

// RENDER CHARTS
/*
 Estas gráficas serán renderizadas dentro de una llamada a la API (fetch) que obtendrá los datos de la base de datos

 Ejemplo de llamada a la API:
  fetch('http://localhost:3000/sprint/id/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  })
    .then((res) => res.json())
    .then((data) => {
      const canvas = document.getElementById("data-chart");
      // PROCESS DATA METHODS
      renderBarChart(canvas, data);
    })
    .catch((err) => console.log(err.message));
 */
renderBarChart(canvas, data);
renderLineChart(canvas2, data);
renderStackedBarChart(canvas3, stackedData, "Story Points by Epic and Label");

// FUNCTIONS
async function renderBarChart(container, data, title) {
  try {
    new Chart(container, {
      type: "bar",
      data: {
        labels: data.data.map((row) => row.label),
        datasets: [
          {
            label: data.label,
            data: data.data.map((row) => row.value),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title || "Gráfica de barras",
          },
        },
      },
    });
  } catch (err) {
    // if ((err.message = "Cannot read properties of null (reading 'id')")) return;
    console.log(err.message);
  }
}

async function renderLineChart(container, data, title) {
  try {
    new Chart(container, {
      type: "line",
      data: {
        labels: data.data.map((row) => row.label),
        datasets: [
          {
            label: data.label,
            data: data.data.map((row) => row.value),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title || "Gráfica de líneas",
          },
        },
      },
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function renderStackedBarChart(container, data, title) {
  try {
    new Chart(container, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title || "Gráfica de barras apiladas",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  } catch (err) {
    if ((err.message = "Cannot read properties of null (reading 'id')")) return;
    console.log(err.message);
  }
}
