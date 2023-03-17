const db = require("../utils/db");

class Role {
  constructor(role) {
    Role.verify(role);
    this.id = role.id || null;
    this.name = role.name;
    if (role?.active === undefined) {
      this.active = 1;
    } else {
      this.active = user.active;
    }
  }
  static async getById(id) {
    let [role, _] = await db.execute(`SELECT * FROM role WHERE id = ?`, [id]);
  }
  static async getAll() {
    let [roles, _] = await db.execute(`SELECT * FROM role`);
    return roles.map((role) => new Role(role));
  }
  static async getAllActive() {
    let [roles, _] = await db.execute(`SELECT * FROM role WHERE active = 1`);
    return roles.map((role) => new Role(role));
  }
  static verify(role) {
    if (role.name?.length > 40) {
      throw new Error("El nombre del rol no puede tener más de 40 caracteres");
    }
    if (role.name?.length == 0) {
      throw new Error("El nombre del rol no puede estar vacío");
    }
  }
  async post() {
    let [res, _] = await db.execute(`INSERT INTO role (name) VALUES (?)`, [
      this.name,
    ]);
    this.id = res.insertId;
    return res;
  }

  async delete() {
    let [res, _] = await db.execute(`UPDATE role SET active = 0 WHERE id = ?`, [
      this.id,
    ]);
    this.active = 0;
    return res;
  }

  addPrivilege(privilege) {
    return db.execute(
      `INSERT INTO role_privilege (id_role, id_privilege) VALUES (?, ?)`,
      [this.id, privilege.id]
    );
  }
}

module.exports = Role;
