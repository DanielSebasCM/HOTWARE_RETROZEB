const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const privilegeMaxLength =
  require("../utils/constants").limits.privilegeMaxLength;
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
    if (privilege.length === 0) return null;
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
    if (privilege.id && !Number.isInteger(privilege.id))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    if (!privilege.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    if (privilege.name.length === 0)
      throw new ValidationError("name", validationMessages.isMandatory);

    if (privilege.name.length > privilegeMaxLength)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(privilegeMaxLength)
      );
  }
}

module.exports = Privilege;
