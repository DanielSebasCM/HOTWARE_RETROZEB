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
    const toggleButtons = container.querySelectorAll(".toggle-button");
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

(function selectactiveTeams() {
  const teamOptions = document.getElementById("team-options");
  if (!teamOptions) return;
  const teamList = teamOptions.querySelectorAll("option");

  teamOptions.addEventListener("change", (event) => {
    teamList.forEach((team) => {
      if (team.value == event.target.value) {
        return fetch(`http://localhost:3000/locals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activeTeam: team.value }),
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  });
})();

(function closeNotification() {
  const closeBtn = document.querySelectorAll(".notification__close");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.parentElement.classList.add("hide");

      const type = btn.dataset.type;

      try {
        return await fetch(`http://localhost:3000/locals/mensajes/${type}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
})();
