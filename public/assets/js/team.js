const addUserToTeamBtn = document.querySelectorAll(".add-team-user-btn");
const removeUserFromTeamBtn = document.querySelectorAll(
  ".remove-team-user-btn"
);

addUserToTeamBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const uid = e.target.dataset.uid;
    const id_team = e.target.dataset.id_team;

    fetch("http://localhost:3000/equipos/nuevo/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, id_team }),
    })
      .then(() => location.reload())
      .catch((err) => {
        location.reload();
        console.error(err);
      });
  });
});

removeUserFromTeamBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const uid = e.target.dataset.uid;
    const id_team = e.target.dataset.id_team;

    fetch("http://localhost:3000/equipos/eliminar/usuario", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, id_team }),
    })
      .then(() => location.reload())
      .catch((err) => {
        location.reload();
        console.error(err);
      });
  });
});
