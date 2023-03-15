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
    // ALREADY TESTED
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

  static async addUserToTeam(id_team, uid) {
    // TODO - TEST THIS
    let [res, _] = await db.execute(
      `INSERT INTO team_users(id_team, uid)
      VALUES (?, ?)`,
      [id_team, uid]
    );
    return res;
  }

  static verify(team) {
    // ALREADY TESTED
    // name is not empty
    if (team.name?.length == 0 || team.name == null)
      throw new Error("El nombre del equipo no puede estar vacío");

    // name is less than 41 characters
    if (team.name?.length > 40)
      throw new Error("El nombre del equipo debe tener máximo 40 caracteres");

    return true;
  }

  async post() {
    // ALREADY TESTED
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
