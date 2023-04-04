const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const projectMaxLength = require("../utils/constants").limits.projectMaxLength;

class Project {
  constructor(project) {
    Project.verify(project);

    this.id = project.id || null;
    this.name = project.name;
    this.id_jira = project.id_jira || null;
    if (project.active === 0 || project.active === 1) {
      this.active = project.active;
    } else {
      project.active = 1;
    }
  }

  static async getById(id) {
    let [project, _] = await db.execute(`SELECT * FROM project WHERE id = ?`, [
      id,
    ]);

    if (project.length === 0) return null;
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
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(40)
      );

    if (project.name?.length === 0)
      throw new ValidationError("name", validationMessages.isMandatory);
    if (!project.name)
      throw new ValidationError("name", validationMessages.isMandatory);
  }

  async post() {
    const [res, _] = await db.execute(
      `INSERT INTO project (name, id_jira, active) VALUES (?, ?, ?)`,
      [this.name, this.id_jira, this.active]
    );

    this.id = res.insertId;

    return res;
  }

  async delete() {
    let [res, _] = await db.execute(
      "UPDATE project SET active = 0 WHERE id = ?",
      [this.id]
    );

    this.active = 0;

    return res;
  }
}

module.exports = Project;
