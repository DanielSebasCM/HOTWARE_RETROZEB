function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const togglerBtn = document.getElementById("sidebar-toggler");

  togglerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    sidebar.classList.add("transition");
  });
}

sidebarToggle();
