// Obtener los elementos del DOM
const searchBar = document.getElementById("buscar");
const orderAlphabetic = document.getElementById("orderAlphabetic");
const userTable = document.getElementById("userSearch");

// Escuchar eventos de cambios en los filtros
searchBar.addEventListener("input", handleSearch);
orderAlphabetic.addEventListener("change", handleOrderAlphabetic);
// Función para filtrar los usuarios por nombre y correo electrónico
function handleSearch() {
  const searchValue = searchBar.value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\r\n\u0300-\u036f]/gm, "");
  const rows = userTable.getElementsByTagName("tr");
  let noResults = true; // variable para indicar si no se encontraron resultados

  for (let i = 0; i < rows.length; i++) {
    const name = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase();
    const email = rows[i]
      .getElementsByTagName("td")[1]
      .textContent.toLowerCase();
    if (name.includes(searchValue) || email.includes(searchValue)) {
      rows[i].style.display = "";
      noResults = false; // establecemos la variable en falso ya que se encontraron resultados
    } else {
      rows[i].style.display = "none";
    }
  }

  // mostramos el mensaje si no se encontraron resultados
  const noResultsMessage = document.querySelector(".no-results");
  if (noResults) {
    noResultsMessage.classList.remove("hide");
  } else {
    noResultsMessage.classList.add("hide");
  }
}

// Función para ordenar los usuarios alfabéticamente
function handleOrderAlphabetic() {
  const orderValue = orderAlphabetic.value;
  const rows = userTable.getElementsByTagName("tr");
  const sortedRows = Array.from(rows)
    .slice(1)
    .sort((a, b) => {
      const nameA = a.getElementsByTagName("td")[0].textContent.toLowerCase();
      const nameB = b.getElementsByTagName("td")[0].textContent.toLowerCase();
      if (orderValue === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  userTable.querySelector("tbody").append(...sortedRows);
}

function handleSelectRole() {
  const activeValue = document.querySelector("p.hide").textContent;
  if (activeValue == 0) {
    return;
  }
  console.log(activeValue);
  const selectedRole = document.getElementById("selectRole").value;
  const tableRows = document.querySelectorAll("#userSearch tbody tr");
  console.log(selectedRole);

  let noResults = true;

  tableRows.forEach((row) => {
    const roleSpans = row.querySelectorAll(".label.label--active");

    let userHasSelectedRole = false;

    roleSpans.forEach((span) => {
      if (
        span.getAttribute("data-idRole") === selectedRole ||
        selectedRole === "all"
      ) {
        userHasSelectedRole = true;
      }
    });

    if (userHasSelectedRole) {
      row.classList.remove("hide");
      noResults = false;
    } else {
      row.classList.add("hide");
    }
  });

  if (noResults) {
    const noResultsMessage = document.querySelector(".no-results");
    noResultsMessage.textContent = `No hay usuarios con el rol ${selectedRole}`;
    noResultsMessage.classList.remove("hide");
  } else {
    document.querySelector(".no-results").classList.add("hide");
  }
}

const selectRole = document.getElementById("selectRole");
selectRole.addEventListener("change", handleSelectRole);
