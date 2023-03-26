const db = require("../utils/db");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const retrospectiveStates =
  require("../utils/constants").enums.retrospectiveStates;

class Retrospective {
  constructor(retrospective) {
    Retrospective.verify(retrospective);

    this.id = retrospective.id || null;
    this.name = retrospective.name;
    this.start_date = retrospective.start_date || new Date();
    this.end_date = retrospective.end_date || null;
    this.state = retrospective.state || "PENDING";
    this.id_team = retrospective.id_team;
    this.id_sprint = retrospective.id_sprint;
  }
  static async getById(id) {
    let [retrospective, _] = await db.execute(
      `SELECT * FROM retrospective WHERE id = ?`,
      [id]
    );
    return new Retrospective(retrospective[0]);
  }
  static async getAll() {
    let [retrospectives, _] = await db.execute(`SELECT * FROM retrospective`);
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
    // Name is not empty
    if (!retrospective.name)
      throw new ValidationError("name", validationMessages.isMandatory);

    // Length of name is less than 40
    if (retrospective.name.length > 40)
      throw new ValidationError(
        "name",
        validationMessages.mustBeShorterThan(40)
      );

    // Has start date
    if (!retrospective.start_date)
      throw new ValidationError("start_date", validationMessages.isMandatory);

    // Start date is valid
    if (!(retrospective.start_date instanceof Date))
      throw new ValidationError("start_date", validationMessages.mustBeDate);

    if (retrospective.end_date) {
      // End date is valid
      if (!(retrospective.end_date instanceof Date))
        throw new ValidationError("end_date", validationMessages.mustBeDate);

      // Start date is before end date
      if (retrospective.start_date >= retrospective.end_date)
        throw new ValidationError(
          "end_date",
          validationMessages.mustBeAfter("start_date")
        );
    }
    // If state exists, it is either PENDING, IN_PROGRESS or CLOSED
    if (retrospective.state) {
      const options = retrospectiveStates;
      if (!options.includes(retrospective.state))
        throw new ValidationError(
          "state",
          validationMessages.mustBeEnum(options)
        );
    }

    // Team id exists
    if (!retrospective.id_team)
      throw new ValidationError("id_team", validationMessages.isMandatory);

    // Sprint id exists
    if (!retrospective.id_sprint)
      throw new ValidationError("id_sprint", validationMessages.isMandatory);
  }
  async post() {
    const [res, _] = await db.execute(
      `INSERT INTO retrospective (name, start_date, end_date, state, id_team, id_sprint) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.name,
        this.start_date,
        this.end_date,
        this.state,
        this.id_team,
        this.id_sprint,
      ]
    );
    return res;
  }

  async put() {
    const [res, _] = await db.execute(
      `UPDATE retrospective SET name = ?, start_date = ?, end_date = ?, state = ?, id_team = ?, id_sprint = ? WHERE id = ?`,
      [
        this.name,
        this.start_date,
        this.end_date,
        this.state,
        this.id_team,
        this.id_sprint,
        this.id,
      ]
    );
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
