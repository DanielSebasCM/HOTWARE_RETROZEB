const db = require("../utils/db");
const messages = require("../utils/messages");

class Team {
  constructor(team) {
    Team.verify(team);
    this.id = team.id || null;
    this.name = team.name;
    this.active = team.active != 0 ? 1 : 0;
    this.creation_date = team.creation_date || new Date();
  }

  static async getById(id) {
    // ALREADY TESTED
    const [team, _] = await db.execute(`SELECT * FROM team WHERE id = ?`, [id]);
    if (team.length == 0) throw new Error(messages.team.error.teamDoesNotExist);
    return new Team(team[0]);
  }

  static async getAll() {
    const [teams, _] = await db.execute(`SELECT * FROM team`);
    return teams.map((team) => new Team(team));
  }

  static getByName = async (name) => {
    try {
      const result = await db.query(
        "SELECT * FROM team WHERE name = ?",
        [name]
      );
      if (!result || result.length === 0) {
        throw new Error(`No se encontró ningún equipo con el nombre ${name}`);
      }
      return result[0];
    } catch (err) {
      throw new Error(`Error al obtener equipo por nombre: ${err.message}`);
    }
  }
  
  

  static async getAllActive() {
    const [teams, _] = await db.execute(`SELECT * FROM team WHERE active = 1`);
    return teams.map((team) => new Team(team));
  }

  async getMembers() {
    const User = require("./user.model");

    const [members, _] = await db.execute(
      "SELECT u.* FROM user u, team_users tu WHERE tu.id_team = ? AND tu.uid = u.uid AND tu.active = 1",
      [this.id]
    );

    return members.map((member) => new User(member));
  }

  static verify(team) {
    // ALREADY TESTED
    if (!team) throw new Error("El equipo no puede estar vacío o no existe");

    // name is not empty
    if (team.name?.length == 0 || team.name == null || !team.name)
      throw new Error("El nombre del equipo no puede estar vacío");

    // name is less than 41 characters
    if (team.name?.length > 40)
      throw new Error("El nombre del equipo debe tener máximo 40 caracteres");

    return true;
  }

  async post() {
    // ALREADY TESTED
    const [res, _] = await db.execute(`INSERT INTO team(name) VALUES (?)`, [
      this.name,
    ]);
    this.id = res.insertId;

    return res;
  }

  async delete() {
    const res = await db.execute(`UPDATE team SET active = 0 WHERE id = ?`, [
      this.id,
    ]);
    return res;
  }

  async activate() {
    const res = await db.execute(`UPDATE team SET active = 1 WHERE id = ?`, [
      this.id,
    ]);
    return res;
  }

  async addUser(uid) {
    // TODO - TEST THIS
    const [res, _] = await db.execute(
      `INSERT INTO team_users(id_team, uid)
      VALUES (?, ?)`,
      [this.id, uid]
    );
    return res;
  }

  async removeUser(uid) {
    // TODO - TEST THIS
    const [res, _] = await db.execute(
      `UPDATE team_users 
      SET active = 0, end_date = ?
      WHERE id_team = ? AND uid = ?`,
      [new Date(), this.id, uid]
    );
    return res;
  }
}

module.exports = Team;
