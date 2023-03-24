const db = require("../utils/db");

class Issue {
  constructor(issue) {
    Issue.verify(issue);

    this.id = issue.id || null;
    this.epic_name = issue.epic_name || null;
    this.story_points = issue.story_points || null;
    this.priority = issue.priority || "Medium";
    this.state = issue.state || "To Do";
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
      throw new Error("Ingresa un nombre de epic");

    // Length of epic_name is less than 40
    if (issue.epic_name?.length > 40)
      throw new Error(
        "El tamaño del nombre de epic debe ser menor a 40 caracteres"
      );

    // Type is not null and of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST
    if (issue.priority) {
      const priority = ["Lowest", "Low", "Medium", "High", "Highest"];
      if (!priority.includes(issue.priority))
        throw new Error("La prioridad no es válida");
    }

    // Type is not null and of type To Do, En curso, Pull requessts, QA, Blocked, Done
    if (issue.state) {
      const state = [
        "To Do",
        "En curso",
        "Pull request",
        "QA",
        "Blocked",
        "Done",
      ];
      if (!state.includes(issue.state))
        throw new Error("El estado no es válido");
    }

    // Length of id_sprint is not null
    if (!issue.id_sprint) throw new Error("id_sprint es obligatorio");

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
