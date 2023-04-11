const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const roleMaxLength = require("../utils/constants").limits.roleMaxLength;
class Role {
  constructor(role) {
    Role.verify(role);
    this.id = role.id || null;
    this.name = role.name;
    if (role?.active === undefined) {
      this.active = 1;
    } else {
      this.active = role.active;
    }
  }
  static async getById(id) {
    let [role, _] = await db.execute(`SELECT * FROM role WHERE id = ?`, [id]);

    if (role.length === 0) return null;
    return new Role(role[0]);
  }
  static async getAll() {
    let [roles, _] = await db.execute(`SELECT * FROM role`);
    return roles.map((role) => new Role(role));
  }
  static async getAllActive() {
    let [roles, _] = await db.execute(`SELECT * FROM role WHERE active = 1`);
    return roles.map((role) => new Role(role));
  }

  static async getPrivileges() {
    let [role_privileges, _] = await db.execute(`SELECT * FROM role_privilege`);
    return role_privileges;
  }

  //----------------VERIFIER----------------

  static verify(role) {
    //id
    if (role.id && !Number.isInteger(Number(role.id))) {
      throw new ValidationError("id", validationMessages.mustBeInteger);
    }

    //name
    if (!role.name) {
      throw new ValidationError("name", validationMessages.isMandatory);
    }
    if (role.name.length > roleMaxLength) {
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(roleMaxLength)
      );
    }
  }

  //----------------POST----------------

  async post() {
    let [res, _] = await db.execute(`INSERT INTO role (name) VALUES (?)`, [
      this.name,
    ]);
    this.id = res.insertId;

    return res;
  }

  //----------------DELETE----------------

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
