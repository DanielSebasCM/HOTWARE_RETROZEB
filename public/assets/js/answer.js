const form = document.getElementById("question-form");
const idRetrospective = window.location.href.split("/")[4];
const uid = document.getElementsByClassName("user")[0].getAttribute("data-uid");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const body = { idRetrospective, uid, questionIds: [] };
  const openQuestions = document.querySelectorAll("article[data-type='OPEN']");
  const scaleQuestions = document.querySelectorAll(
    "article[data-type='SCALE']"
  );

  const booleanQuestions = document.querySelectorAll(
    "article[data-type='BOOLEAN']"
  );

  const selectionQuestions = document.querySelectorAll(
    "article[data-type='SELECTION']"
  );

  for (let question of openQuestions) {
    const input = question.querySelector("input");
    const value = input?.value;
    const id = input?.name.split("-")[1];
    body[id] = value;
    body["questionIds"].push(id);
  }

  for (let question of scaleQuestions) {
    const input = question.querySelector("input:checked");
    const value = input?.value;
    const id = input?.name.split("-")[1];
    body[id] = value;
    body["questionIds"].push(id);
  }

  for (let question of booleanQuestions) {
    const input = question.querySelector("input:checked");
    const value = input?.value;
    const id = input?.name.split("-")[1];
    body[id] = value;
    body["questionIds"].push(id);
  }

  for (let question of selectionQuestions) {
    const input = question.querySelector("select");
    const value = input?.value;
    const id = input?.name.split("-")[1];
    body[id] = value;
    body["questionIds"].push(id);
  }

  const tokens = getTokens();

  fetch(window.location.href, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + tokens.authToken,
    },
  })
    .then(() => {
      window.location.href = `${routes.retrospectives}/${idRetrospective}/preguntas`;
    })
    .catch((err) => {
      console.log(err);
    });
});
