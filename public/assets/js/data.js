(async function () {
  const data = [
    { epic: "Epic 1", count: 10 },
    { epic: "Epic 2", count: 20 },
    { epic: "Epic 3", count: 15 },
    { epic: "Epic 4", count: 25 },
    { epic: "Epic 5", count: 22 },
    { epic: "Epic 6", count: 30 },
    { epic: "Epic 7", count: 28 },
  ];

  new Chart(document.getElementById("data-chart"), {
    type: "bar",
    data: {
      labels: data.map((row) => row.epic),
      datasets: [
        {
          label: "Story Points by Epic",
          data: data.map((row) => row.count),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Custom Chart Title",
        },
      },
    },
  });

  new Chart(document.getElementById("data-chart-line"), {
    type: "line",
    data: {
      labels: data.map((row) => row.epic),
      datasets: [
        {
          label: "Story Points by Epic",
          data: data.map((row) => row.count),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Custom Chart Title",
        },
      },
    },
  });

  new Chart(document.getElementById("data-stacked"), {
    type: "bar",
    data: {
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
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Custom Chart Title",
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
})();
