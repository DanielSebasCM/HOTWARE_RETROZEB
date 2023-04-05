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
  if (location.pathname == "/login") return deleteSessionCookies();

  const logoutForm = document.getElementById("logout-form");
  logoutForm.addEventListener("submit", (e) => {
    deleteSessionCookies();
  });
})();

function deleteSessionCookies() {
  // Delete cookies
  document.cookie =
    "rzauthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "rzrefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
