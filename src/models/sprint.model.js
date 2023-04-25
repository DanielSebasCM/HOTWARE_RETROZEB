const db = require("../utils/db");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const sprintMaxLength = require("../utils/constants").limits.sprintMaxLength;
class Sprint {
  constructor(sprint) {
    Sprint.verify(sprint);

    this.id = sprint.id || null;
    this.name = sprint.name;
    this.id_jira = sprint.id_jira || null;
    this.start_date = sprint.start_date || null;
    this.end_date = sprint.end_date || null;
    this.id_project = sprint.id_project || null;
  }

  static async getById(id) {
    let [sprint, _] = await db.execute(`SELECT * FROM sprint WHERE id = ?`, [
      id,
    ]);

    if (sprint.length === 0) return null;
    return new Sprint(sprint[0]);
  }

  static async getByJiraId(id_jira) {
    let [sprint, _] = await db.execute(
      `SELECT * FROM sprint WHERE id_jira = ?`,
      [id_jira]
    );

    if (sprint.length === 0) return null;
    return new Sprint(sprint[0]);
  }

  static async getLastWithoutRetroByTeamId(id_team) {
    let [sprint, _] = await db.execute(
      `
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
    `,
      [id_team]
    );

    if (sprint.length == 0) return null;
    return new Sprint(sprint[0]);
  }

  static async getLast() {
    let [sprint, _] = await db.execute(`
    SELECT *
    FROM sprint
    ORDER BY start_date DESC
    LIMIT 1
    `);

    if (sprint.length == 0) return null;
    return new Sprint(sprint[0]);
  }

  static async getLastWithRetroByTeamId(id_team) {
    let [sprint, _] = await db.execute(
      `
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
    `,
      [id_team]
    );

    if (sprint.length == 0) return null;
    return new Sprint(sprint[0]);
  }

  static async getAll() {
    let [sprint, _] = await db.execute(`SELECT * FROM sprint`);
    return sprint.map((sprint) => new Sprint(sprint));
  }

  static async syncJira() {
    const {
      fetchProjectJiraLatestSprint,
      fetchSprintIssues,
    } = require("../utils/jira");
    const jiraSprint = await fetchProjectJiraLatestSprint(
      process.env.ZECOMMERCE_PROJECT_ID,
      "closed"
    );
    if (!jiraSprint || jiraSprint.id) return;

    jiraSprint.post();

    const issues = await fetchSprintIssues(jiraSprint.id_jira);

    issues.forEach((issue) => {
      issue.post();
    });
  }

  static verify(sprint) {
    // id
    if (sprint.id && !Number.isInteger(Number(sprint.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // name
    if (!sprint.name)
      throw new ValidationError("name", validationMessages.mustBeString);

    if (sprint.name.length > sprintMaxLength)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(sprintMaxLength)
      );

    // id_jira
    if (sprint.id_jira && !Number.isInteger(Number(sprint.id_jira)))
      throw new ValidationError("id_jira", validationMessages.mustBeInteger);

    // start_date
    if (sprint.start_date && !(sprint.start_date instanceof Date))
      throw new ValidationError("start_date", validationMessages.mustBeDate);

    // end_date
    if (sprint.end_date && !(sprint.end_date instanceof Date))
      throw new ValidationError("end_date", validationMessages.mustBeDate);

    // id_project
    if (sprint.id_project && !Number.isInteger(Number(sprint.id_project)))
      throw new ValidationError("id_project", validationMessages.mustBeInteger);

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
