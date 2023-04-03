const db = require("../utils/db");

const Question = require("./question.model");
const Answer = require("./answer.model");
const Issue = require("./issue.model");
const User = require("./user.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const retrospectiveStates =
  require("../utils/constants").enums.retrospectiveStates;
const retrospectiveMaxLength =
  require("../utils/constants").limits.retrospectiveMaxLength;

class Retrospective {
  constructor(retrospective) {
    Retrospective.verify(retrospective);

    this.id = retrospective.id || null;
    this.name = retrospective.name;
    this.start_date = retrospective.start_date;
    this.end_date = retrospective.end_date || null;
    this.state = retrospective.state;
    this.id_team = retrospective.id_team;
    this.id_sprint = retrospective.id_sprint;
  }
  static async getById(id) {
    let [retrospective, _] = await db.execute(
      `SELECT * FROM retrospective WHERE id = ?`,
      [id]
    );

    if (retrospective.length === 0) throw new Error("Retrospective not found");
    return new Retrospective(retrospective[0]);
  }
  static async getAll() {
    let [retrospectives, _] = await db.execute(
      `SELECT * FROM retrospective ORDER BY start_date DESC`
    );
    return retrospectives.map(
      (retrospective) => new Retrospective(retrospective)
    );
  }
  static async getAllPending() {
    let [retrospectives, _] = await db.execute(
      `SELECT * FROM retrospective WHERE state = "PENDING"`
    );
    return retrospectives.map(
      (retrospective) => new Retrospective(retrospective)
    );
  }
  static async getAllInProgress() {
    let [retrospectives, _] = await db.execute(
      `SELECT * FROM retrospective WHERE state = "IN_PROGRESS"`
    );
    return retrospectives.map(
      (retrospective) => new Retrospective(retrospective)
    );
  }
  static async getAllClosed() {
    let [retrospectives, _] = await db.execute(
      `SELECT * FROM retrospective WHERE state = "CLOSED"`
    );
    return retrospectives.map(
      (retrospective) => new Retrospective(retrospective)
    );
  }
  static verify(retrospective) {
    // id
    if (retrospective.id && !Number.isInteger(Number(retrospective.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // Name is not empty
    if (!retrospective.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    // Length of name is less than 40
    if (retrospective.name.length > retrospectiveMaxLength)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(retrospectiveMaxLength)
      );

    // Start date is valid
    if (retrospective.start_date && !(retrospective.start_date instanceof Date))
      throw new ValidationError("start_date", validationMessages.mustBeDate);

    // End date is valid
    if (retrospective.end_date && !(retrospective.end_date instanceof Date))
      throw new ValidationError("end_date", validationMessages.mustBeDate);

    // If state exists, it is either PENDING, IN_PROGRESS or CLOSED

    if (
      retrospective.state &&
      !retrospectiveStates.includes(retrospective.state)
    )
      throw new ValidationError(
        "state",
        validationMessages.mustBeEnum(retrospectiveStates)
      );

    // Team id exists
    if (!retrospective.id_team)
      throw new ValidationError("id_team", validationMessages.isMandatory);

    if (!Number.isInteger(Number(retrospective.id_team)))
      throw new ValidationError("id_team", validationMessages.mustBeInteger);

    // Sprint id exists
    if (!retrospective.id_sprint)
      throw new ValidationError("id_sprint", validationMessages.isMandatory);

    if (!Number.isInteger(Number(retrospective.id_sprint)))
      throw new ValidationError("id_sprint", validationMessages.mustBeInteger);
  }
  async getIssues() {
    const [issues, _] = await db.execute(
      "SELECT i.* FROM retrospective AS r JOIN sprint AS s ON r.id = ? AND s.id = r.id_sprint JOIN issues AS i ON i.id_sprint = s.id;",
      [this.id]
    );

    for (let issue of issues) {
      const [labels, __] = await db.execute(
        `SELECT label FROM issues_labels WHERE id_issue = ?`,
        [issue.id]
      );
      issue.labels = labels.map((label) => label.label);
    }

    return issues.map((issue) => new Issue(issue));
  }

  async getQuestions() {
    const [questions, _] = await db.execute(
      "SELECT q.*, rq.required FROM question q, retrospective r, retrospective_question rq WHERE r.id = ? AND r.id = rq.id_retrospective AND rq.id_question = q.id",
      [this.id]
    );

    for (let question of questions) {
      if (question.type === "SELECTION") {
        const [options, _] = await db.execute(
          "SELECT * FROM `option` WHERE id_question = ?",
          [question.id]
        );
        question.options = options;
      }
    }

    return questions.map((question) => {
      const builtQuestion = new Question(question);
      builtQuestion.required = question.required;
      return builtQuestion;
    });
  }

  async getAnswers(question) {
    const [answers, _] = await db.execute(
      "SELECT * FROM answer WHERE id_retrospective = ? AND id_question = ?",
      [this.id, question.id]
    );

    if (question.type === "SELECTION") {
      for (let answer of answers) {
        const [newValue, _] = await db.execute(
          "SELECT description FROM `option` WHERE id = ?",
          [answer.value]
        );
        answer.value = newValue[0].description;
      }
    }
    return answers.map((answer) => new Answer(answer));
  }

  async getLabels() {
    const [labels, _] = await db.execute(
      "select distinct label from issues_labels as l, issues as i, sprint as s, retrospective as r where r.id = ? and r.id_sprint = s.id and s.id = i.id_sprint and i.id = l.id_issue",
      [this.id]
    );
    return labels.map((label) => label.label);
  }

  async getUsers() {
    const [users, _] = await db.execute(
      "select u.* from user as u join team_users as tu on tu.uid = u.uid and tu.id_team = ? and tu.active = 1",
      [this.id_team]
    );
    return users.map((user) => new User(user));
  }

  async post() {
    const [res, _] = await db.execute(
      `INSERT INTO retrospective (name, id_team, id_sprint) VALUES (?, ?, ?)`,
      [this.name, this.id_team, this.id_sprint]
    );

    this.id = res.insertId;

    return res;
  }

  async postAnswers(answers, uid) {
    for (let answer of answers) {
      await db.execute(
        `INSERT INTO answer (id_retrospective, id_question, uid, value) VALUES (?, ?, ?, ?)`,
        [this.id, answer.id_question, uid, answer.value]
      );
    }
  }

  async addQuestion(question) {
    const [res, _] = await db.execute(
      `INSERT INTO retrospective_question (id_retrospective, id_question, required, annonimous) VALUES (?, ?, ?, ?)`,
      [
        this.id,
        question.id,
        question.required ? 1 : 0,
        question.annonimous ? 1 : 0,
      ]
    );

    this.id = res.insertId;

    return res;
  }

  async delete() {
    const [res, _] = await db.execute(
      `DELETE FROM retrospective WHERE id = ?`,
      [this.id]
    );
    return res;
  }
}

module.exports = Retrospective;
