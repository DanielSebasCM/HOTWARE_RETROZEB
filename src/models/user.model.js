const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const Team = require("./team.model");

class User {
  constructor(user) {
    User.verify(user);
    this.uid = user.uid || null;
    this.id_jira = user.id_jira || null;
    this.id_google_auth = user.id_google_auth || "abcd";
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    if (user?.active === undefined) {
      this.active = 1;
    } else {
      this.active = user.active;
    }
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

    if (answer.length === 0) return null;
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
      `SELECT t.* FROM team t, team_users tu WHERE tu.uid = ? AND tu.id_team = t.id AND tu.active = 1 AND t.active = 1`,
      [this.uid]
    );
    teams.map((team) => new Team(team));
    return teams;
  }

  static async getByGoogleId(id_google_auth) {
    let [user, _] = await db.execute(
      `SELECT * FROM user WHERE id_google_auth = ?`,
      [id_google_auth]
    );
    return new User(user[0]);
  }
  static async getAllActive() {
    let [users, _] = await db.execute(`SELECT * FROM user WHERE active = 1`);
    return users.map((user) => new User(user));
  }

  //----------------------------VERIFY--------------------------------
  static verify(user) {
    if (!user) throw new ValidationError("user", validationMessages.isEmpty);

    if (!user.first_name) {
      throw new ValidationError("first_name", validationMessages.isMandatory);
    }
    if (user.first_name.length > 40) {
      throw new ValidationError(
        "first_name",
        validationMessages.mustBeShorterThan(40)
      );
    }

    if (!user.last_name) {
      throw new ValidationError("last_name", validationMessages.isMandatory);
    }
    if (user.last_name.length > 40) {
      throw new ValidationError(
        "last_name",
        validationMessages.mustBeShorterThan(40)
      );
    }

    if (!user.email) {
      throw new ValidationError("email", validationMessages.isMandatory);
    }

    if (user.email.length > 40) {
      throw new ValidationError(
        "email",
        validationMessages.mustBeShorterThan(40)
      );
    }
  }

  //---------------------------POST----------------------------------
  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO user (id_jira, id_google_auth, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)`,
      [
        this.id_jira,
        this.id_google_auth,
        this.first_name,
        this.last_name,
        this.email,
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
    this.active = 0;
    return res;
  }

  async addRole(role) {
    return db.execute(`INSERT INTO users_roles (uid, id_role) VALUES (?, ?)`, [
      this.uid,
      role.id,
    ]);
  }
}

module.exports = User;
