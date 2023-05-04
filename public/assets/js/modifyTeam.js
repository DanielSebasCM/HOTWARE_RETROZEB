const searchInput = document.querySelector(".search-bar input");
const data = document.querySelectorAll("#users-container tbody tr");
const tableData = document.querySelector("#users-container tbody");
const noResults = document.querySelector(".no-results");

// SEARCH BAR
searchInput.addEventListener("keyup", () => {
  searchData(searchInput.value);
});

// UTILS
function searchData(value) {
  value = value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\r\n\u0300-\u036f]/gm, "");

  data.forEach((user) => {
    console.log(user);
    const titleText = user.querySelector(".table__title");
    const text = titleText.innerHTML
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\r\n\u0300-\u036f]/gm, "");

    text.includes(value)
      ? user.classList.remove("hide")
      : user.classList.add("hide");
  });

  handleEmpty();
}

function showAll() {
  data.forEach((retro) => {
    retro.classList.remove("hide");
  });
}

function handleEmpty() {
  const hiddenRetros = document.querySelectorAll(
    "#users-container tbody tr.hide"
  );

  noResults.classList.add("hide");
  if (hiddenRetros.length === data.length) {
    noResults.innerHTML = `No se encontraron resultados para "${searchInput.value}"`;
    noResults.classList.remove("hide");
  }
}
