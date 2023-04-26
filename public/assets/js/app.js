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

(function multiSelectSelection() {
  const multiSelectContainers = document.querySelectorAll(
    ".multi-select-container"
  );
  if (!multiSelectContainers) return;

  const dropdowns = [];

  window.addEventListener("click", function (e) {
    for (let container of multiSelectContainers) {
      if (!container.contains(e.target)) {
        container.querySelector(".multi-select-dropdown").classList.add("hide");
      }
    }
  });

  multiSelectContainers.forEach((container) => {
    const button = container.querySelector(".multi-select-button");

    const display = container.querySelector(".multi-select-display");
    display.originalText = display.innerText;

    const dropdown = container.querySelector(".multi-select-dropdown");
    dropdowns.push(dropdown);
    dropdown.classList.add("hide");

    button.addEventListener("click", () => {
      dropdown.classList.toggle("hide");
    });

    const options = dropdown.querySelectorAll(
      ".multi-select-dropdown__checkbox"
    );

    container.selectedOptions = [];
    options.forEach((option) => {
      if (option.checked && option.id !== "All") {
        container.selectedOptions.push(option.id || null);
      }

      option.addEventListener("change", () => {
        if (option.id === "All") {
          options.forEach((o) => {
            o.checked = option.checked;
          });

          container.selectedOptions = [];
          if (option.checked) {
            options.forEach((o) => {
              if (o.id !== "All") container.selectedOptions.push(o.id || null);
            });
          }
        } else {
          if (option.checked) {
            container.selectedOptions.push(option.id || null);
          } else {
            options.forEach((o) => {
              if (o.id === "All") o.checked = false;
            });
            container.selectedOptions = container.selectedOptions.filter(
              (o) => o !== (option.id || null)
            );
          }
        }
        if (container.selectedOptions.length > 0) {
          display.innerText = `${display.originalText} (${container.selectedOptions.length})`;
        } else {
          display.innerText = display.originalText;
        }
      });
    });

    if (container.selectedOptions.length > 0) {
      display.innerText = `${display.originalText} (${container.selectedOptions.length})`;
    } else {
      display.innerText = display.originalText;
    }
  });
})();

(function selectactiveTeams() {
  const teamOptions = document.getElementById("team-options");
  if (!teamOptions) return;
  const form = teamOptions.closest("form");

  teamOptions.addEventListener("change", () => {
    return form.submit();
  });
})();

(function closeNotification() {
  const closeBtn = document.querySelectorAll(".notification__close");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.parentElement.classList.add("hide");
    });
  });
})();

(function hideNotificationAfterTime() {
  const notification = document.querySelectorAll(".notification");
  if (!notification) return;

  notification.forEach((notification) => {
    setTimeout(() => {
      notification.classList.add("hide");
    }, 5000);
  });
})();

(function logout() {
  // if (location.pathname == "/login") return deleteTokens();

  const logoutForm = document.getElementById("logout-form");
  logoutForm.addEventListener("submit", (e) => {
    deleteTokens();
  });
})();

(function pinterestCards() {
  const pinterestContainers = document.querySelectorAll(".pinterest-container");
  if (!pinterestContainers) return;

  pinterestContainers.forEach((container) => {
    const cards = container.querySelectorAll(".card");
    if (!cards) return;
    cards.forEach((card) => {
      console.log(card.offsetHeight);
      card.style.gridRowEnd = `span ${Math.ceil(card.offsetHeight / 10) + 2}`;
    });
  });
})();
