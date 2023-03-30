const searchInput = document.querySelector(".search-bar input");
const noResults = document.querySelector(".no-results.search");
const questionsQuantity = document.getElementById("questions-quantity");
const selectedQuestions = document.getElementById("selected-questions");

//Buscar
searchInput.addEventListener("keyup", () => {
  const questions = document.querySelectorAll(
    ".questions__list .card--question-checkbox"
  );

  const filter = searchInput.value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\r\n\u0300-\u036f]/gm, "");

  questions.forEach((question) => {
    const questionText = question.querySelector(".question");
    const text = questionText.value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\r\n\u0300-\u036f]/gm, "");
    text.includes(filter)
      ? question.classList.remove("hide")
      : question.classList.add("hide") && count++;
  });

  const hiddenQuestions = document.querySelectorAll(
    ".card--question-checkbox.hide"
  );

  console.log("hiddenQuestions.length", hiddenQuestions.length);
  console.log("questions.length", questions.length);

  noResults.classList.add("hide");
  if (hiddenQuestions.length === questions.length) {
    noResults.innerHTML = `No se encontraron resultados para "${searchInput.value}"`;
    noResults.classList.remove("hide");
  }

  questionsQuantity.innerHTML = `Preguntas (${
    questions.length - hiddenQuestions.length
  })`;
});

(function handleCheck() {
  const questions = document.querySelectorAll(".card--question-checkbox");

  questions.forEach((question) => {
    const checkbox = question.querySelector(".question-checkbox");
    const pill = question.querySelector(".label");

    checkbox.addEventListener("click", () => {
      question.classList.toggle("selected");
      pill.classList.toggle("label--inactive");
      pill.classList.toggle("label--success");

      const clone = question.cloneNode(true);

      if (question.classList.contains("selected")) {
        selectedQuestions
          .querySelector(".questions__resume-list")
          .appendChild(clone);
      } else {
        const clonedNode = selectedQuestions.querySelector(
          "[data-id='" + question.dataset.id + "']"
        );
        clonedNode.remove();
      }

      const cloneCheckbox = clone.querySelector(".question-checkbox");
      const cloneRequiredCheckbox = clone.querySelector(
        ".question-required-checkbox"
      );
      cloneCheckbox.name = "checked";
      cloneRequiredCheckbox.name = "required";

      cloneCheckbox.addEventListener("click", () => {
        clone.remove();
        checkbox.checked = false;

        question.classList.toggle("selected");
        pill.classList.toggle("label--inactive");
        pill.classList.toggle("label--success");
      });
    });
  });
})();
