const addUserToTeamBtn = document.querySelectorAll('.add-team-user-btn');


addUserToTeamBtn.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const uid = e.target.dataset.uid;
    const id_team = e.target.dataset.id_team;

    const response = await fetch('http://localhost:3000/equipos/nuevo/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, id_team }),
    });

    const data = await response.json();

    if (response.status == 200) {
      alert(data.message);
      location.reload();
    } else {
      alert(data.message);
    }
  });
});