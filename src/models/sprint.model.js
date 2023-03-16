const db = require("../utils/db");

class Sprint {
  constructor(sprint) {
    Sprint.verify(sprint);

    this.id = sprint.id || null;
    this.name = sprint.name;
    this.id_jira = sprint.id_jira || null;
    this.start_date = sprint.start_date;
    this.end_date = sprint.end_date || null;
    this.id_project = sprint.id_project || null;
  }

  static async getById(id) {
    let [sprint, _] = await db.execute(`SELECT * FROM sprint WHERE id = ?`, [
      id,
    ]);
    return new Sprint(sprint[0]);
  }

  static async getAll() {
    let [sprint, _] = await db.execute(`SELECT * FROM sprint`);
    return sprint.map((sprint) => new Sprint(sprint));
  }

  static verify(sprint) {
    // Length of name is less than 40
    if (sprint.name?.length > 40)
      throw new Error("El nombre del sprint debe ser menor a 40 caracteres");

    // Name is not empty
    if (sprint.name?.length == 0)
      throw new Error("Ingresa un nombre para el sprint");

    if (sprint.start_date == 0 || sprint.start_date == null) {
      throw new Error("Ingresa una fecha para el sprint");
    }

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      // id_project?
      `INSERT INTO sprint(name, start_date)
      VALUES (?, ?)`,
      [this.name, this.start_date]
    );
    this.id = res.insertId;

    return res;
  }

  async delete() {
    let [res, _] = await db.execute(`DELETE FROM sprint WHERE id = ?`, [
      this.id,
    ]);
    return res;
  }
}

module.exports = Sprint;
