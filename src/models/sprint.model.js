const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

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

  static async getLastWithoutRetroByTeamId(id_team){
    let [sprint, _] = await db.execute(`
    SELECT *
    FROM sprint
    WHERE id NOT IN (
      SELECT r.id_sprint
      FROM retrospective as r
      WHERE r.id_team = ?
    )
    AND end_date IS NOT NULL
    ORDER BY end_date DESC
    LIMIT 1
    `, [
      id_team,
    ]);
    if(sprint.length == 0)return null; 
    
    return new Sprint(sprint[0]);
  }

  static async getLastWithRetroByTeamId(id_team){
    let [sprint, _] = await db.execute(`
    SELECT *
    FROM sprint
    WHERE id IN (
        SELECT r.id_sprint
        FROM retrospective as r
        WHERE r.id_team = ?
    )
    AND end_date IS NOT NULL
    ORDER BY end_date DESC
    LIMIT 1
    `, [
      id_team,
    ]);
    if(sprint.length == 0)return null; 
    
    return new Sprint(sprint[0]);
  }

  static async getAll() {
    let [sprint, _] = await db.execute(`SELECT * FROM sprint`);
    return sprint.map((sprint) => new Sprint(sprint));
  }

  static verify(sprint) {
    // Length of name is less than 40
    if (sprint.name?.length > 40)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(40)
      );

    // Name is not empty
    if (sprint.name?.length == 0)
      throw new ValidationError("name", validationMessages.isMandatory);

    if (!sprint.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    if (sprint.start_date == 0 || sprint.start_date == null) {
      throw new ValidationError("start_date", validationMessages.isMandatory);
    }

    if (sprint.end_date) {
      if (!(sprint.end_date instanceof Date)) {
        throw new ValidationError("end_date", validationMessages.isMandatory);
      }

      if (sprint.end_date <= sprint.start_date) {
        throw new ValidationError(
          "end_date",
          validationMessages.mustBeAfter(sprint.start_date)
        );
      }
    }

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      // id_project?
      `INSERT INTO sprint(name, id_jira, start_date, end_date, id_project) VALUES (?, ?, ?, ?, ?)`,
      [this.name, this.id_jira, this.start_date, this.end_date, this.id_project]
    );
    this.id = res.insertId;

    return res;
  }
}

module.exports = Sprint;
