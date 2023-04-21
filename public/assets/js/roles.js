const rolesSelect = document.getElementById("select-roles");

rolesSelect.addEventListener("change", (e) => {
  const roleID = e.target.value;

  window.location.href = `/roles/${roleID}/modificar`;
});
