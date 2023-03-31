const searchInput = document.querySelector(".search-bar input");
const data = document.querySelectorAll("#retrospectivasSearch tbody tr");
const tableData = document.querySelector("#retrospectivasSearch tbody");
const noResults = document.querySelector(".no-results");

const selectTeamName = document.getElementById("select-team-name");
const selectSortDate = document.getElementById("selectSortDate");

// TEAM SELECTION
selectTeamName.addEventListener("change", () => {
  showAll();
  filterByTeam(selectTeamName.value);

  const value = searchInput.value;
  if (value) searchData(value);
});

// SORT BY DATE
selectSortDate.addEventListener("change", () => {
  const value = selectSortDate.value;

  if (value == "asc") {
    for (let i = 0; i < data.length; i++) {
      tableData.appendChild(data[i]);
    }
  }

  if (value == "desc") {
    for (let i = data.length - 1; i >= 0; i--) {
      tableData.appendChild(data[i]);
    }
  }

  searchData(searchInput.value);
});

// SEARCH BAR
searchInput.addEventListener("keyup", () => {
  searchData(searchInput.value);
});

// UTILS
function filterByTeam(id) {
  if (!id) return;
  if (id === "all") return showAll();

  data.forEach((retro) => {
    const idTeam = retro.querySelector(".table__team").dataset.idteam;
    if (idTeam !== id) retro.classList.add("hide");
  });
}

function searchData(value) {
  value = value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\r\n\u0300-\u036f]/gm, "");

  data.forEach((retro) => {
    const titleText = retro.querySelector(".table__title");
    const text = titleText.innerHTML
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\r\n\u0300-\u036f]/gm, "");

    text.includes(value)
      ? retro.classList.remove("hide")
      : retro.classList.add("hide");
  });

  const selectedTeam = selectTeamName.value;
  if (selectedTeam !== "all") filterByTeam(selectedTeam);

  handleEmpty();
}

function showAll() {
  data.forEach((retro) => {
    retro.classList.remove("hide");
  });
}

function handleEmpty() {
  const hiddenRetros = document.querySelectorAll(
    "#retrospectivasSearch tbody tr.hide"
  );

  noResults.classList.add("hide");
  if (hiddenRetros.length === data.length) {
    noResults.innerHTML = `No se encontraron resultados para "${searchInput.value}"`;
    noResults.classList.remove("hide");
  }
}
