const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const teamNameMaxLength =
  require("../utils/constants").limits.teamNameMaxLength;

class Team {
  constructor(team) {
    Team.verify(team);
    this.id = team.id || null;
    this.name = team.name;
    this.active = team.active === 0 ? 0 : 1;
  }

  static async getById(id) {
    // ALREADY TESTED
    const [team, _] = await db.execute(`SELECT * FROM team WHERE id = ?`, [id]);

    if (team.length == 0) return null;
    return new Team(team[0]);
  }

  static async getAll() {
    const [teams, _] = await db.execute(`SELECT * FROM team`);
    return teams.map((team) => new Team(team));
  }

  static async getAllActive() {
    const [teams, _] = await db.execute(`SELECT * FROM team WHERE active = 1`);
    return teams.map((team) => new Team(team));
  }

  async getMembers() {
    const User = require("./user.model");

    const [members, _] = await db.execute(
      "SELECT u.* FROM user u, team_users tu WHERE tu.id_team = ? AND tu.uid = u.uid",
      [this.id]
    );

    return members.map((member) => new User(member));
  }

  static verify(team) {
    // ALREADY TESTED
    // id
    if (team.id && !Number.isInteger(Number(team.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // name
    if (!team.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    if (team.name.length > teamNameMaxLength)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(teamNameMaxLength)
      );

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

    this.active = 0;
    return res;
  }

  async activate() {
    const res = await db.execute(`UPDATE team SET active = 1 WHERE id = ?`, [
      this.id,
    ]);

    this.active = 1;
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
      `DELETE FROM team_users WHERE id_team = ? AND uid = ?`,
      [this.id, uid]
    );
    return res;
  }

  async removeTeam(id) {
    const [res, _] = await db.execute(
      `UPDATE team 
      SET active='0' 
      WHERE id = ?;
      `,
      [id]
    );
    return res;
  }

  async getActiveRetrospective() {
    const Retrospective = require("./retrospective.model");

    // TODO - TEST THIS
    const [retros, _] = await db.execute(
      `
    SELECT r.* 
    FROM retrospective as r, team as t, sprint as s
    WHERE r.id_team = t.id
    AND r.id_sprint = s.id
    AND t.id = ?
    AND (r.end_date IS NULL or r.state = "PENDING" or r.state = "IN_PROGRESS")
      `,
      [this.id]
    );
    if (retros.length == 0) return null;
    return new Retrospective(retros[0]);
  }

  async getNClosedRetrospectives(n) {
    const Retrospective = require("./retrospective.model");

    // TODO - TEST THIS
    const [retros, _] = await db.execute(
      `
    SELECT r.* , s.name as sprint_name
    FROM retrospective as r, team as t, sprint as s
    WHERE r.id_team = t.id
    AND r.id_sprint = s.id
    AND t.id = ?
    AND r.end_date IS NOT NULL
    AND r.state = "CLOSED"
    ORDER BY r.end_date DESC
    LIMIT ?
      `,
      [this.id, n]
    );
    return retros.map((retro) => {
      const r = new Retrospective(retro);
      r.sprint_name = retro.sprint_name;
      return r;
    });
  }
}

module.exports = Team;
