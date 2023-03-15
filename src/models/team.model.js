const db = require("../utils/db");

class Team {
  constructor(team) {
    Team.verify(team);

    this.id = team.id || null;
    this.name = team.name || "Default team";
    this.active = team.active || 1;
    this.creation_date = team.creation_date || new Date();
  }

  static async getById(id) {
    let [team, _] = await db.execute(`SELECT * FROM team WHERE id = ?`, [id]);
    return new Team(team[0]);
  }

  static async getAll() {
    let [teams, _] = await db.execute(`SELECT * FROM team`);
    return teams.map((team) => new Team(team));
  }

  static async getAllActive() {
    let [teams, _] = await db.execute(`SELECT * FROM team WHERE active = 1`);
    return teams.map((team) => new Team(team));
  }

  static verify(team) {
    // name is not empty
    if (team.name?.length == 0 || team.name == null)
      throw new Error("El nombre del equipo no puede estar vacío");

    // name is less than 41 characters
    if (team.name?.length > 40)
      throw new Error("El nombre del equipo debe tener máximo 40 caracteres");

    // active is not null
    if (team.active == null)
      throw new Error("El estado 'activo' del equipo no puede estar vacío");

    // active is 0 or 1
    if (team.active != 0 && team.active != 1)
      throw new Error("El estado 'activo' del equipo debe ser 0 o 1");

    // creation_date is not null
    if (team.creation_date == null)
      throw new Error("La fecha de creación del equipo no puede estar vacía");

    // creation_date is greater than today
    if (team.creation_date > new Date())
      throw new Error(
        "La fecha de creación del equipo no puede ser mayor a la fecha actual"
      );

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO team(name, active)
      VALUES (?, ?)`,
      [this.name, this.active]
    );
    this.id = res.insertId;

    return res;
  }

  async delete() {
    return await db.execute(`DELETE FROM team WHERE id = ?`, [this.id]);
  }
}

module.exports = Team;
