const searchInput = document.querySelector(".search-bar input");
const data = document.querySelectorAll('#retrospectivasSearch tbody tr');
const tableData = document.querySelector('#retrospectivasSearch tbody');
const selectTeamName = document.getElementById("select-team-name");
const selectSortDate = document.getElementById("selectSortDate");

selectTeamName.addEventListener("change",(event) => {
  const idteam = event.target.value;
  filterByTeams(data, idteam);
})

selectSortDate.addEventListener("change", () => {
  const data = document.querySelectorAll('#retrospectivasSearch tbody tr');
  toggleSortByDate(data);
})

//Buscar
  searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase().trim();

    data.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const display = text.indexOf(filter) > -1 ? '' : 'none';
      item.style.display = display;
    });
  });


function filterByTeams(data, idteam) {
  data.forEach((item) => {
    if(idteam == item.dataset.idteam || idteam == "todos" || !idteam){
      item.classList.remove("hide");
    }else{
      item.classList.add("hide");
    }
   
  });
}

function toggleSortByDate(data){
  tableData.innerHTML = "";
  for(let i = data.length -1; i > 0; i-- ){
    tableData.appendChild(data[i]);
  }
}
