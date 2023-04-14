const cardsContainer = document.querySelector(".cards-container");
const searchInput = document.querySelector(".search-bar input");

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  cardsContainer.querySelectorAll(".card").forEach((card) => {
    const cardText = card
      .querySelector(".card__subtitle")
      .textContent.toLowerCase()
      .trim();
    if (cardText.includes(searchText)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
});
