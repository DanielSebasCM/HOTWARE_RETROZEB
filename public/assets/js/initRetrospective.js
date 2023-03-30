const searchInput = document.querySelector(".search-bar input");
const data = document.querySelectorAll('.card--question-checkbox');

//Buscar
searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase().trim();

    data.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const display = text.indexOf(filter) > -1 ? '' : 'none';
      item.style.display = display;
    });
  });