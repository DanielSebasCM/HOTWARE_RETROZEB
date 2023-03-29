const selectQuestionType = document.getElementById("select-question-type");
const cardsContainer = document.querySelector(".cards-container");
const searchInput = document.querySelector(".search-bar input");
const cards = document.querySelectorAll(".card--question");
let selectedQuestionType = "";

selectQuestionType.addEventListener("change", () => {
  selectedQuestionType = selectQuestionType.value.toLowerCase().trim();
  filterCards();
});

searchInput.addEventListener("input", () => {
  filterCards();
});

function filterCards() {
  const searchText = searchInput.value.trim().toLowerCase();
  cards.forEach((card) => {
    const cardType = card
      .querySelector(".label--active")
      .textContent.toLowerCase()
      .trim();
    const cardText = card
      .querySelector(".card__subtitle")
      .textContent.toLowerCase()
      .trim();
    if (
      (!selectedQuestionType || cardType === selectedQuestionType) &&
      cardText.includes(searchText)
    ) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}
