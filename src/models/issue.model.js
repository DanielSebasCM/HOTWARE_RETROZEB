const db = require("../utils/db");

class Issue {
  constructor(issue) {
    Issue.verify(issue);

    this.id = issue.id || null;
    this.epic_name = issue.epic_name || null;
    this.story_points = issue.story_points || null;
    this.priority = issue.priority || "MEDIUM";
    this.state = issue.state || "TO DO";
    this.uid = issue.uid || null;
    this.id_sprint = issue.id_sprint;
  }

  static async getById(id) {
    let [issue, _] = await db.execute(`SELECT * FROM issue WHERE id = ?`, [id]);

    return new Issue(issue[0]);
  }

  static async getAll() {
    let [issue, _] = await db.execute(`SELECT * FROM issue`);
    return issue.map((issue) => new Issue(issue));
  }

  static verify(issue) {
    // Length of epic_name is not null
    if (!issue.epic_name) throw new Error("Ingresa un nombre de epic");

    // Length of epic_name is less than 40
    if (issue.epic_name?.length > 40)
      throw new Error(
        "El tamaño del nombre de epic debe ser menor a 40 caracteres"
      );

    // Length of story_points is less than 11
    if (issue.story_points?.length > 11)
      throw new Error(
        "El story_points del issue debe ser menor a 11 caracteres"
      );

    // Type is not null and of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST
    if (issue.priority) {
      const priority = ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"];
      if (!priority.includes(issue.priority))
        throw new Error("La prioridad no es válida");
    }

    // Type is not null and of type To Do, En curso, Pull requessts, QA, Blocked, Done
    if (issue.state) {
      const state = [
        "TO DO",
        "EN CURSO",
        "PULL REQUESTS",
        "QA",
        "BLOCKED",
        "DONE",
      ];
      if (!state.includes(issue.state))
        throw new Error("El estado no es válido");
    }

    // Length of id_sprint is not null
    if (!issue.id_sprint) throw new Error("id_sprint es obligatorio");

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      // id_project?
      `INSERT INTO sprint(epic_name, story_points)
      VALUES (?, ?)`,
      [this.epic_name, this.story_points]
    );
    this.id = res.insertId;

    return res;
  }

  async delete() {
    let [res, _] = await db.execute(`DELETE FROM issue WHERE id = ?`, [
      this.id,
    ]);
    return res;
  }
}

module.exports = Issue;
