const db = require("../utils/db");

class Question {
  constructor(question) {
    Question.verify(question);

    this.id = question.id || null;
    this.description = question.description;
    this.type = question.type;
    this.active = question.active || 1;

    if (this.type == "SELECTION") {
      this.options = question.options;
    }
  }

  static async getById(id) {
    let [question, _] = await db.execute(
      `SELECT * FROM question WHERE id = ?`,
      [id]
    );
    return new Question(question[0]);
  }

  static async getAll() {
    let [questions, _] = await db.execute(`SELECT * FROM question`);
    return questions.map((question) => new Question(question));
  }

  static async getAllActive() {
    let [questions, _] = await db.execute(
      `SELECT * FROM question WHERE active = 1`
    );
    return questions.map((question) => new Question(question));
  }

  static verify(question) {
    // Length of description is less than 255
    if (question.description?.length > 255)
      throw new Error(
        "El tamaño de la pregunta debe ser menor a 255 caracteres"
      );

    // Description is not empty
    if (question.description?.length == 0)
      throw new Error("Ingresa una pregunta");

    // Type is not null and of type OPEN, BOOLEAN, SCALE or SELECTION
    const options = ["OPEN", "BOOLEAN", "SCALE", "SELECTION"];
    if (!options.includes(question.type))
      throw new Error("El tipo de pregunta no es válido");

    // Option is SELECTION and Option is not null and length > 1
    if (question.type === "SELECTION") {
      if (!question.options) throw new Error("Ingresa al menos dos opciones");

      if (question.options.length < 2)
        throw new Error("Ingresa al menos dos opciones");

      // Option is SELECTION and Option is not null and length < 25 && length > 0
      question.options.forEach((option) => {
        if (!option)
          throw new Error(
            "El tamaño de cada opción debe ser mayor a 0 caracteres"
          );
        if (option.length > 25)
          throw new Error(
            "El tamaño de cada opción debe ser menor a 25 caracteres"
          );
        if (option.length == 0)
          throw new Error(
            "El tamaño de cada opción debe ser mayor a 0 caracteres"
          );
      });
    }
    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO question(description, type)
      VALUES (?, ?)`,
      [this.description, this.type]
    );
    this.id = res.insertedId;

    // TODO - Add question with options
    return res;
  }

  delete() {
    // TODO
  }
}

module.exports = Question;
