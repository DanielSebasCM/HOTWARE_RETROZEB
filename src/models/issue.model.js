const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const issuePriorities = require("../utils/constants").enums.issuePriorities;
const issueStates = require("../utils/constants").enums.issueStates;

class Issue {
  constructor(issue) {
    Issue.verify(issue);

    this.id = issue.id || null;
    this.epic_name = issue.epic_name || null;
    this.story_points = issue.story_points || null;
    this.priority = issue.priority || "Medium";
    this.state = issue.state || "To Do";
    this.type = issue.type || "Task";
    this.uid = issue.uid || null;
    this.id_sprint = issue.id_sprint;
    this.labels = issue.labels || null;
  }

  static async getById(id) {
    let [issue, _] = await db.execute(`SELECT * FROM issues WHERE id = ?`, [
      id,
    ]);

    if (issue.length == 0) throw new Error("Issue no encontrado");

    const [labels, __] = await db.execute(
      `SELECT label FROM issues_labels WHERE id_issue = ?`,
      [id]
    );

    issue[0].labels = labels.map((label) => label.label);
    return new Issue(issue[0]);
  }

  static async getAll() {
    let [issues, _] = await db.execute(`SELECT * FROM issues`);

    for (let issue of issues) {
      const [labels, __] = await db.execute(
        `SELECT label FROM issues_labels WHERE id_issue = ?`,
        [issue.id]
      );
      issue.labels = labels.map((label) => label.label);
    }

    return issues.map((issue) => new Issue(issue));
  }

  static verify(issue) {
    // Length of epic_name is not null
    if (issue.epic_name?.length == 0)
      throw new ValidationError("epic_name", validationMessages.isMandatory);

    // Length of epic_name is less than 40
    if (issue.epic_name?.length > 40)
      throw new ValidationError(
        "epic_name",
        validationMessages.mustBeShorterThan(40)
      );

    // Type is not null and of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST
    if (issue.priority) {
      if (!issuePriorities.includes(issue.priority))
        throw new ValidationError(
          "priority",
          validationMessages.mustBeEnum(issuePriorities)
        );
    }

    // Type is not null and of type To Do, En curso, Pull requessts, QA, Blocked, Done
    if (issue.state) {
      if (!issueStates.includes(issue.state))
        throw new ValidationError(
          "state",
          validationMessages.mustBeEnum(issueStates)
        );
    }

    // Length of id_sprint is not null
    if (!issue.id_sprint)
      throw new ValidationError("id_sprint", validationMessages.isMandatory);

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      // id_project?
      `INSERT INTO issues (epic_name, story_points, priority, state, uid, id_sprint) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.epic_name,
        this.story_points,
        this.priority,
        this.state,
        this.uid,
        this.id_sprint,
      ]
    );

    if (this.labels.length > 0) {
      let query = `INSERT INTO issues_labels (id_issue, label) VALUES (?, ?)`;
      for (let label of this.labels) {
        db.execute(query, [res.insertId, label]);
      }
    }

    this.id = res.insertId;
    return res;
  }
}

module.exports = Issue;
