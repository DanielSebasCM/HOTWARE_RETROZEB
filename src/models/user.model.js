const db = require("../utils/db");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const Team = require("./team.model");
const Privilege = require("./privilege.model");
const Role = require("./role.model");

class User {
  constructor(user) {
    User.verify(user);
    this.uid = user.uid || null;
    this.id_jira = user.id_jira || null;
    this.id_google_auth = user.id_google_auth || "abcd";
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.picture = user.picture || null;
    // this.active = user.active;
    this.active = user.active === 0 ? 0 : 1;
  }
  static async getAll() {
    let [users, _] = await db.execute(`SELECT * FROM user`);
    return users.map((user) => new User(user));
  }

  static async getById(uid) {
    let [user, _] = await db.execute(`SELECT * FROM user WHERE uid = ?`, [uid]);

    if (user.length === 0) return null;
    return new User(user[0]);
  }

  static async getByJiraId(id_jira) {
    let [user, _] = await db.execute(`SELECT * FROM user WHERE id_jira = ?`, [
      id_jira,
    ]);

    if (user.length === 0) return null;
    return new User(user[0]);
  }

  static async getByEmail(email) {
    let [user, _] = await db.execute(`SELECT * FROM user WHERE email = ?`, [
      email,
    ]);

    if (user.length === 0) return null;
    return new User(user[0]);
  }

  async getTeams() {
    const [teams, _] = await db.execute(
      `SELECT t.* FROM team t, team_users tu WHERE tu.uid = ? AND tu.id_team = t.id`,
      [this.uid]
    );

    return teams.map((team) => new Team(team));
  }

  async getActiveTeams() {
    const [teams, _] = await db.execute(
      `SELECT t.* FROM team t, team_users tu WHERE tu.uid = ? AND tu.id_team = t.id AND t.active = 1`,
      [this.uid]
    );
    teams.map((team) => new Team(team));
    return teams;
  }

  async getPrivileges() {
    const [privileges, _] = await db.execute(
      "SELECT p.* FROM privilege p, users_roles ur, role_privilege rp WHERE ur.uid = ? AND ur.id_role = rp.id_role AND rp.id_privilege = p.id",
      [this.uid]
    );

    return privileges.map((privilege) => new Privilege(privilege));
  }

  async getRoles() {
    const [roles, _] = await db.execute(
      "SELECT r.* FROM role r, users_roles ur WHERE ur.uid = ? AND ur.id_role = r.id",
      [this.uid]
    );
    return roles.map((role) => new Role(role));
  }

  static async getByGoogleId(id_google_auth) {
    let [user, _] = await db.execute(
      `SELECT * FROM user WHERE id_google_auth = ?`,
      [id_google_auth]
    );

    if (user.length === 0) return null;
    return new User(user[0]);
  }

  static async getAllActive() {
    let [users, _] = await db.execute(`SELECT * FROM user WHERE active = 1`);
    return users.map((user) => new User(user));
  }

  static async getAllInactive() {
    let [users, _] = await db.execute(`SELECT * FROM user WHERE active = 0`);
    return users.map((user) => new User(user));
  }

  //----------------------------VERIFY--------------------------------
  static verify(user) {
    if (user.uid && !Number.isInteger(Number(user.uid)))
      throw new ValidationError("uid", validationMessages.mustBeInteger);

    if (!user.id_google_auth)
      throw new ValidationError(
        "id_google_auth",
        validationMessages.isMandatory
      );

    if (!user.first_name)
      throw new ValidationError("first_name", validationMessages.isMandatory);

    if (!user.last_name)
      throw new ValidationError("last_name", validationMessages.isMandatory);

    if (!user.email)
      throw new ValidationError("email", validationMessages.isMandatory);
  }

  //---------------------------POST----------------------------------
  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO user (id_jira, id_google_auth, first_name, last_name, email, picture) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.id_jira,
        this.id_google_auth,
        this.first_name,
        this.last_name,
        this.email,
        this.picture,
      ]
    );
    this.uid = res.insertId;

    return res;
  }

  //------------------------DELETE-------------------------------------
  async delete() {
    let [res, _] = await db.execute(
      `UPDATE user SET active = 0 WHERE uid = ?`,
      [this.uid]
    );
    await db.execute(`DELETE FROM users_roles WHERE uid = ?`, [this.uid]);
    this.active = 0;
    return res;
  }

  async activate() {
    let [res, _] = await db.execute(
      `UPDATE user SET active = 1 WHERE uid = ?`,
      [this.uid]
    );
    this.active = 1;
    return res;
  }

  async addRole(role) {
    return db.execute(`INSERT INTO users_roles (uid, id_role) VALUES (?, ?)`, [
      this.uid,
      role.id,
    ]);
  }
  async setRoles(roles) {
    await db.execute(`DELETE FROM users_roles WHERE uid = ?`, [this.uid]);
    for (let role of roles) {
      await this.addRole(role);
    }
  }

  async addJiraId(id_jira) {
    return db.execute(`UPDATE user SET id_jira = ? WHERE uid = ?`, [
      id_jira,
      this.uid,
    ]);
  }
}

module.exports = User;
