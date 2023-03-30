// Cambiar el tipo de pregunta
const selectQuestionType = document.getElementById("select-question-type");
const selectionForm = document.getElementById("selection-form");

selectQuestionType.addEventListener("change", function () {
  if (this.value === "SELECTION") {
    selectionForm.classList.remove("hide");
  } else {
    selectionForm.classList.add("hide");
  }
});

// Agregar y eliminar opciones de respuesta
const addAnswerButton = document.getElementById("add-answers");
const answerContainer = document.getElementById("answers");

addAnswerButton.addEventListener("click", function (event) {
  event.preventDefault();

  const newAnswer = document.createElement("div");
  newAnswer.classList.add("option-container");
  newAnswer.innerHTML = `
  <input class="input" type="text" name="option" placeholder="Nueva opción" />
  <button type = "button" class="button button--delete-question option-container icon">
  </button>
  `;
  answerContainer.appendChild(newAnswer);

  const deleteButton = newAnswer.querySelector(".button--delete-question");
  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();
    newAnswer.remove();
  });
});

// Cambiar el placeholder del input de pregunta dependiendo del tipo de pregunta
const questionTypeSelect = document.getElementById("select-question-type");
let selectedOption = questionTypeSelect.value;
const questionInput = document.getElementById("question-input");

questionTypeSelect.addEventListener("change", function () {
  selectedOption = this.value;

  const optionInputs = [...document.querySelectorAll("[name=option]")];
  if (selectedOption === "SELECTION") {
    questionInput.placeholder = "¿Qué día sentiste que fuiste mas productivo?";
    optionInputs.forEach((input) => (input.required = true));
  } else if (selectedOption === "BOOLEAN") {
    questionInput.placeholder =
      "¿Crees que la plataforma genera valor y será utilizada?";
    optionInputs.forEach((input) => (input.required = false));
  } else if (selectedOption === "SCALE") {
    questionInput.placeholder =
      "¿Qué tan cansado te sentiste acabando este sprint?";
    optionInputs.forEach((input) => (input.required = false));
  } else if (selectedOption === "OPEN") {
    questionInput.placeholder = "¿Cómo fue el sprint pasado?";
    optionInputs.forEach((input) => (input.required = false));
  }
});
