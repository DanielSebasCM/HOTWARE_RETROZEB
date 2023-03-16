const db = require("../utils/db");

class Project {
  constructor(project) {
    Project.verify(project);

    this.id = project.id || null;
    this.name = project.name;
    this.jira_id = project.jira_id || null;
    this.active = project.active || 1;
  }

  static async getById(id) {
    let [project, _] = await db.execute(`SELECT * FROM project WHERE id = ?`, [
      id,
    ]);

    return new Project(project[0]);
  }

  static async getAll() {
    let [projects, _] = await db.execute(`SELECT * FROM project`);

    return projects.map((project) => new Project(project));
  }

  static async getAllActive() {
    let [projects, _] = await db.execute(
      `SELECT * FROM project WHERE active = 1`
    );

    return projects.map((project) => new Project(project));
  }

  static verify(project) {
    // Lenght of name is less than 40
    if (project.name?.length > 40)
      throw new Error("El tamaño del nombre debe ser menor a 40 caracteres");
  }

  post() {
    const [res, _] = db.execute(
      `INSERT INTO project (name, jira_id, active) VALUES (?, ?, ?)`,
      [this.name, this.jira_id, this.active]
    );

    this.id = res.insertId;
  }

  delete() {
    return ([res, _] = db.execute(
      "UPDATE project SET active = 0 WHERE id = ?",
      [this.id]
    ));
  }
}

module.exports = Project;
