(function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const togglerBtn = document.getElementById("sidebar-toggler");

  if (!sidebar || !togglerBtn) return;
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

(function selectActiveTeam() {
  const teamOptions = document.getElementById("team-options");
  if(!teamOptions) return;
  const teamList = teamOptions.querySelectorAll("option");

  teamOptions.addEventListener("change", (event) => {
    teamList.forEach((team) => {
      if (team.value == event.target.value) {
        return fetch(`http://localhost:3000/dashboard?team=${team.value}`, {
          method: "GET",
        })
          .then(() => {
            location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
})();
