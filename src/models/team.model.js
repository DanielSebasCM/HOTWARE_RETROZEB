const db = require("../utils/db");

class Team {
  constructor(team) {
    Team.verify(team);

    this.id = team.id || null;
    this.name = team.name;
    this.active = team.active != 0 ? 1 : 0;
    this.creation_date = team.creation_date || new Date();
    this.members = team.members || [];
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

  static async getAllWithUsers() {
    let [teams, _] = await db.execute(
      `
      SELECT tu.id_team, t.name, t.creation_date, u.first_name, u.last_name
      FROM team as t, user as u, team_users as tu 
      WHERE t.id = tu.id_team
      AND u.uid = tu.uid
      AND t.active = 1
      AND u.active = 1
      AND tu.active = 1
      `
    );

    const teamNames = new Set(teams.map((team) => team.name));
    const teamsWithMembers = Object.fromEntries(
      Array.from(teamNames).map((name) => [
        name,
        { name: "", id: "", members: [], creation_date: "" },
      ])
    );

    teams.forEach((team) => {
      teamsWithMembers[team.name].members.push({
        first_name: team.first_name,
        last_name: team.last_name,
      });
      teamsWithMembers[team.name].name = team.name;
      teamsWithMembers[team.name].id = team.id_team;
      teamsWithMembers[team.name].creation_date = team.creation_date;
    });

    return Object.values(teamsWithMembers).map((team) => new Team(team));
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
    if (team.name?.length == 0 || team.name == null || !team.name)
      throw new Error("El nombre del equipo no puede estar vacío");

    // name is less than 41 characters
    if (team.name?.length > 40)
      throw new Error("El nombre del equipo debe tener máximo 40 caracteres");

    return true;
  }

  async post() {
    // ALREADY TESTED
    let [res, _] = await db.execute(`INSERT INTO team(name) VALUES (?)`, [
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
}

module.exports = Team;
