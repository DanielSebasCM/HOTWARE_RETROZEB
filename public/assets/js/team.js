//NUEVO EQUIPO
const modalButton = document.getElementById("modal-button");
const modalContainer = document.getElementById("modal-container");

modalButton.addEventListener("click", function () {
  modalContainer.style.display = "block";
});

modalContainer.addEventListener("click", function (event) {
  if (event.target === modalContainer) {
    modalContainer.style.display = "none";
  }
});

const modalContent = document.createElement("div");
modalContent.setAttribute("id", "modal-content");
modalContent.setAttribute("class", "modal-content");

modalContent.innerHTML = `
    <h2 class="title">Crea un equipo nuevo</h2>
    <form method="POST" action="/equipos/nuevo" id="form">
      <div class="form-group">
        <label for="name" class="description">Nombre del equipo</label>
        <input type="text" class="input mt-1 mb-2" id="recipient-name" name="name">
      </div>
    
      <div class="buttons-container">
        <button class="button button--primary" type="submit">Guardar</button>
        <a class="button button--discard" id="modal-close">Descartar</a>
      </div>
    </form>
    `;
modalContainer.appendChild(modalContent);

// Agrega un evento de clic al botón de cerrar para ocultar el modal
const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", function () {
  modalContainer.style.display = "none";
});
