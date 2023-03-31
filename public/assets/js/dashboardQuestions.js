let url = window.location.href.split("/");
url[5] = "respuestas";
url = url.join("/");

Chart.defaults.font.family = "Poppins";

let response = await fetch(url);
let data = await response.json();
let questions = data.filter((question) => question.type !== "OPEN");

for (let question of questions) {
  let chart = document.getElementById(`chart-${question.id}`);

  if (question.type === "BOOLEAN") {
    const trueCount = question.answers.filter(
      (answer) => answer.value === "TRUE"
    );
    const falseCount = question.answers.filter(
      (answer) => answer.value === "FALSE"
    );
    new Chart(chart, {
      type: "bar",
      data: {
        labels: ["Si", "No"],
        datasets: [
          {
            data: [trueCount.length, falseCount.length],
            borderWidth: 1,
            backgroundColor: ["#bee8b4", "#fd8d8d"],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else if (question.type === "SCALE") {
    const count = {};

    for (let answer of question.answers) {
      count[answer.value] = count[answer.value] ? count[answer.value] + 1 : 1;
    }
    new Chart(chart, {
      type: "bar",
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
            data: [
              count[1],
              count[2],
              count[3],
              count[4],
              count[5],
              count[6],
              count[7],
              count[8],
              count[9],
              count[10],
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    const count = {};
    for (let answer of question.answers) {
      count[answer.value] = count[answer.value] ? count[answer.value] + 1 : 1;
    }
    const answerCount = [];
    for (let attribute in count) {
      answerCount.push(count[attribute]);
    }
    new Chart(chart, {
      type: "bar",
      data: {
        labels: question.options.map((option) => option.description),
        datasets: [
          {
            data: answerCount,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
