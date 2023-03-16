const db = require("../utils/db");

class Issue {
  constructor(issue) {
    Issue.verify(issue);

    this.id = issue.id || null;
    this.epic_name = issue.name || null;
    this.story_points = issue.id_jira || null;
    this.priority = issue.start_date;
    this.state = issue.end_date;
    this.uid = issue.id_project || null;
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
    // Length of epic_name is less than 40
    if (issue.epic_name?.length > 40)
      throw new Error("El epic_name del issue debe ser menor a 40 caracteres");

    // Length of story_points is less than 11
    if (issue.story_points?.length > 11)
      throw new Error(
        "El story_points del issue debe ser menor a 11 caracteres"
      );

    // Type is not null and of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST
    const priority = ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"];
    if (!priority.includes(issue.priority))
        throw new Error("Ingresa una prioridad válida");

    if (issue.priority?.length == 0 || issue.priority == null)
      throw new Error("Ingresa una prioridad para el issue");

    // Type is not null and of type TODO, IN_PROGRESS, DONE
    const state = ["TODO", "IN_PROGRESS", "DONE"];
    if (!state.includes(issue.state))
        throw new Error("Ingresa un estado válido");
    
    if (issue.state?.length == 0 || issue.state == null)
      throw new Error("Ingresa un estado para el issue");

    // Length of id_sprint is not null
    if (issue.id_sprint?.length == 0 || issue.id_sprint == null)
      throw new Error("Ingresa un sprint para el issue");

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
    let [res, _] = await db.execute(`DELETE FROM issue WHERE id = ?`, [this.id]);
    return res;
  }
}

module.exports = Issue;
