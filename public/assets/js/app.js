(function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const togglerBtn = document.getElementById("sidebar-toggler");

  togglerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    sidebar.classList.add("transition");
  });
})();

(function toggleButtonSelection() {
  const toggleButtonContainer = document.querySelectorAll(
    ".toggle-buttons-container"
  );

  toggleButtonContainer.forEach((container) => {
    const toggleButtons = container.querySelectorAll("button");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        toggleButtons.forEach((button) => {
          button.classList.remove("toggle-button--active");
        });
        button.classList.add("toggle-button--active");
      });
    });
  });
})();
