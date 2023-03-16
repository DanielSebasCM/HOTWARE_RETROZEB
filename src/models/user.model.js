const db = require("../utils/db");
class User {
  constructor(user) {
    this.uid = user.uid || null;
    this.id_jira = user.id_jira || null;
    this.id_google_auth = user.id_google_auth || null;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.active = user.active || 1;
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
  static verify(user) {
    if (user.id_jira?.length > 40) {
      throw new Error("El id de jira no puede tener más de 40 caracteres");
    }

    if (user.id_google_auth?.length > 255) {
      throw new Error("El id de google no puede tener más de 255 caracteres");
    }

    if (user.id_google_auth?.length == 0) {
      throw new Error("El id de google no puede estar vacío");
    }

    if (user.first_name?.length > 40) {
      throw new Error("El nombre no puede tener más de 40 caracteres");
    }
    if (user.first_name?.length == 0) {
      throw new Error("El nombre no puede estar vacío");
    }
    if (user.last_name?.length > 40) {
      throw new Error("El apellido no puede tener más de 40 caracteres");
    }
    if (user.last_name?.length == 0) {
      throw new Error("El apellido no puede estar vacío");
    }
    if (user.email?.length > 40) {
      throw new Error("El email no puede tener más de 40 caracteres");
    }
    if (user.email?.length == 0) {
      throw new Error("El email no puede estar vacío");
    }
  }
  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO user (id_jira, id_google_auth, first_name, last_name, email, active) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.id_jira,
        this.id_google_auth,
        this.first_name,
        this.last_name,
        this.email,
        this.active,
      ]
    );
  }
  addRole(role) {
    return db.execute(`INSERT INTO users_roles (uid, id_role) VALUES (?, ?)`, [
      this.uid,
      role.id,
    ]);
  }
}
