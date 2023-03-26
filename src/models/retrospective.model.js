const db = require("../utils/db");

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
    if (!retrospective.name) throw new Error("Ingresa un nombre");

    // Length of name is less than 40
    if (retrospective.name.length > 40)
      throw new Error("El tamaño del nombre debe ser menor a 40 caracteres");

    // Has start date
    if (!retrospective.start_date)
      throw new Error("Ingresa una fecha de inicio");

    // Start date is valid
    if (!(retrospective.start_date instanceof Date))
      throw new Error("Fecha debe ser una instancia de Date");

    if (retrospective.end_date) {
      // End date is valid
      if (!(retrospective.end_date instanceof Date))
        throw new Error("Fecha debe ser una instancia de Date");

      // Start date is before end date
      if (retrospective.start_date >= retrospective.end_date)
        throw new Error("La fecha de inicio debe ser menor a la fecha de fin");
    }
    // If state exists, it is either PENDING, IN_PROGRESS or CLOSED
    if (retrospective.state) {
      const options = ["PENDING", "IN_PROGRESS", "CLOSED"];
      if (!options.includes(retrospective.state))
        throw new Error("Estado inválido");
    }

    // Team id exists
    if (!retrospective.id_team) throw new Error("Ingresa un id de equipo");

    // Team id is valid
    if (!Number.isInteger(retrospective.id_team))
      throw new Error("Id de equipo inválido");

    // Sprint id exists
    if (!retrospective.id_sprint) throw new Error("Ingresa un id de sprint");

    // Sprint id is valid
    if (!Number.isInteger(retrospective.id_sprint))
      throw new Error("Ingresa un id de sprint");
  }

  async getQuestions() {
    const [questions, _] = await db.execute(
      "SELECT q.*, rq.required FROM question q, retrospective r, retrospective_question rq WHERE r.id = ? AND r.id = rq.id_retrospective AND rq.id_question = q.id",
      [this.id]
    );

    return questions;
  }

  async getAnswers(question) {
    if (question.type === "SELECTION") {
      console.log(this.id, question.id);
      const [answers, _] = await db.execute(
        "SELECT a.*, o.description FROM answer a, `option` o WHERE a.id_retrospective = ? AND a.id_question = ? AND a.id = o.id_question",
        [this.id, question.id]
      );
      return answers;
    }
    const [answers, _] = await db.execute(
      "SELECT * FROM answer WHERE id_retrospective = ? AND id_question = ?",
      [this.id, question.id]
    );

    return answers;
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
