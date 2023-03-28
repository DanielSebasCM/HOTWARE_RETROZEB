const selectQuestionType = document.getElementById("select-question-type");
const cardsContainer = document.querySelector(".cards-container");

selectQuestionType.addEventListener("change", () => {
  const selectedQuestionType = selectQuestionType.value;
  const cards = cardsContainer.querySelectorAll(".card--question");
  cards.forEach((card) => {
    const cardType = card
      .querySelector(".label--active")
      .textContent.toLowerCase();
    if (
      !selectedQuestionType ||
      selectedQuestionType.toLowerCase() === cardType
    ) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
});

const searchInput = document.querySelector(".search-bar input");
const cards = document.querySelectorAll(".card--question");

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  cards.forEach((card) => {
    const cardText = card
      .querySelector(".card_subtitle")
      .textContent.toLowerCase();
    if (cardText.includes(searchText)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
});