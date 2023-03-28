const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

class Team {
  constructor(team) {
    Team.verify(team);

    this.id = team.id || null;
    this.name = team.name;
    this.active = team.active != 0 ? 1 : 0;
    this.creation_date = team.creation_date || new Date();
    this.members = team.members;
    this.isMember = team.isMember || false;
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

  static async getAllActiveByUser(uid) {
    let [teams, _] = await db.execute(
      `SELECT DISTINCT t.* FROM team as t, team_users as tu WHERE tu.id_team = t.id AND tu.uid = ? AND t.active = 1 AND tu.active = 1 ORDER BY t.name ASC`,
      [uid]
    );

    return teams.map((team) => new Team(team));
  }

  static async getAllWithUsers(uid = null) {
    let [teams] = await db.execute(
      `SELECT DISTINCT * FROM team WHERE active = 1`
    );

    let [members, _] = await db.execute(
      `
      SELECT tu.id_team, u.uid, u.first_name, u.last_name
      FROM user as u, team_users as tu  
      WHERE u.uid = tu.uid
      AND u.active = 1
      AND tu.active = 1
      ORDER BY u.first_name ASC
      `
    );

    const teamsWithMembers = Object.fromEntries(
      Array.from(teams).map((team) => {
        team.members = [];
        return [team.id, team];
      })
    );

    members.forEach((member) => {
      teamsWithMembers[member.id_team].isMember =
        member.uid === uid ? true : false;
      teamsWithMembers[member.id_team].members.push({
        first_name: member.first_name,
        last_name: member.last_name,
        uid: member.uid,
      });
    });

    return Object.values(teamsWithMembers).map((team) => new Team(team));
  }

  static async getUserById(id_team, uid) {
    // TODO - TEST THIS
    let [user, _] = await db.execute(
      `SELECT * FROM team_users WHERE id_team = ? AND uid = ?`,
      [id_team, uid]
    );
    return user;
  }

  static verify(team) {
    // ALREADY TESTED
    if (!team)
      throw new ValidationError("name", validationMessages.isMandatory);

    // name is not empty
    if (team.name?.length == 0 || team.name == null || !team.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    // name is less than 41 characters
    if (team.name?.length > 40)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(40)
      );

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

  async addUser(uid) {
    // TODO - TEST THIS
    let [res, _] = await db.execute(
      `INSERT INTO team_users(id_team, uid)
      VALUES (?, ?)`,
      [this.id, uid]
    );
    console.log(res);
    return res;
  }

  async removeUser(uid) {
    // TODO - TEST THIS
    let [res, _] = await db.execute(
      `UPDATE team_users 
      SET active = 0, end_date = ?
      WHERE id_team = ? AND uid = ?`,
      [new Date(), this.id, uid]
    );
    return res;
  }
}

module.exports = Team;
