const db = require("../utils/db");

class Privilege {
  constructor(privilege) {
    Privilege.verify(privilege);
    this.id = privilege.id || null;
    this.name = privilege.name;
  }

  static async getAll() {
    let [privileges, _] = await db.execute(`SELECT * FROM privilege`);
    return privileges.map((privilege) => new Privilege(privilege));
  }

  static async getById(id) {
    let [privilege, _] = await db.execute(
      `SELECT * FROM privilege WHERE id = ?`,
      [id]
    );
    return new Privilege(privilege[0]);
  }

  static async create(privilege) {
    let [result, _] = await db.execute(
      `INSERT INTO privilege (name) VALUES (?)`,
      [privilege.name]
    );
    return result.insertId;
  }

  static async update(id, privilege) {
    let [result, _] = await db.execute(
      `UPDATE privilege SET name = ? WHERE id = ?`,
      [privilege.name, id]
    );
    return result.affectedRows;
  }

  static verify(privilege) {
    if (privilege.name?.length > 40) {
      throw new Error(
        "El nombre del privilegio no puede tener más de 40 caracteres"
      );
    }
    if (privilege.name?.length == 0) {
      throw new Error("El nombre del privilegio no puede estar vacío");
    }
  }
}

module.exports = Privilege;
