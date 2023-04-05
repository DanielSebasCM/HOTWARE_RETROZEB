const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const issuePriorities = require("../utils/constants").enums.issuePriorities;
const issueStates = require("../utils/constants").enums.issueStates;
const issueTypes = require("../utils/constants").enums.issueTypes;
const epicsNameMaxLength =
  require("../utils/constants").limits.epicsNameMaxLength;

class Issue {
  constructor(issue) {
    Issue.verify(issue);

    this.id = issue.id || null;
    this.id_jira = issue.id_jira || null;
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

    if (issue.length == 0) return null;
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
    // id
    if (issue.id && !Number.isInteger(Number(issue.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // id_jira
    if (issue.id_jira && !Number.isInteger(Number(issue.id_jira)))
      throw new ValidationError("id_jira", validationMessages.mustBeInteger);

    // epic_name
    if (issue.epic_name?.length == 0)
      throw new ValidationError("epic_name", validationMessages.isMandatory);

    if (issue.epic_name?.length > epicsNameMaxLength)
      throw new ValidationError(
        "epic_name",
        validationMessages.mustBeShorterThan(epicsNameMaxLength)
      );

    // story_points
    if (issue.story_points && !Number.isInteger(Number(issue.story_points)))
      throw new ValidationError(
        "story_points",
        validationMessages.mustBeInteger
      );

    // priority
    if (issue.priority && !issuePriorities.includes(issue.priority))
      throw new ValidationError(
        "priority",
        validationMessages.mustBeEnum(issuePriorities)
      );

    // state
    if (issue.state && !issueStates.includes(issue.state))
      throw new ValidationError(
        "state",
        validationMessages.mustBeEnum(issueStates)
      );

    // type
    if (issue.type && !issueTypes.includes(issue.type))
      throw new ValidationError(
        "type",
        validationMessages.mustBeEnum(issueTypes)
      );

    // uid
    if (issue.uid && !Number.isInteger(Number(issue.uid)))
      throw new ValidationError("uid", validationMessages.mustBeInteger);

    // Length of id_sprint is not null
    if (!issue.id_sprint)
      throw new ValidationError("id_sprint", validationMessages.isMandatory);

    if (!Number.isInteger(Number(issue.id_sprint)))
      throw new ValidationError("id_sprint", validationMessages.mustBeInteger);

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO issues (id_jira, epic_name, story_points, priority, state, type, uid, id_sprint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.id_jira,
        this.epic_name,
        this.story_points,
        this.priority,
        this.state,
        this.type,
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
