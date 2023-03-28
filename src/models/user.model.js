const db = require("../utils/db");
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
    return new User(user[0]);
  }

  static async getByJiraId(id_jira) {
    let [user, _] = await db.execute(`SELECT * FROM user WHERE id_jira = ?`, [
      id_jira,
    ]);
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
      `SELECT t.* FROM team t, team_users tu WHERE tu.uid = ? AND tu.id_team = t.id AND tu.active = 1`,
      [this.uid]
    );
    console.log(teams);
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
    if (!user.first_name) {
      throw new Error("El nombre no puede estar vacío");
    }
    if (user.first_name.length > 40) {
      throw new Error("El nombre no puede tener más de 40 caracteres");
    }

    if (!user.last_name) {
      throw new Error("El apellido no puede estar vacío");
    }
    if (user.last_name.length > 40) {
      throw new Error("El apellido no puede tener más de 40 caracteres");
    }

    if (!user.email) {
      throw new Error("El email no puede estar vacío");
    }

    if (user.email.length > 40) {
      throw new Error("El email no puede tener más de 40 caracteres");
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
