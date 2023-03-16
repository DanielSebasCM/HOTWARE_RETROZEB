const db = require("../utils/db");

class Answer {
  constructor(answer) {
    Answer.verify(answer);

    this.id = answer.id || null;
    this.value = answer.value;
    this.uid = answer.uid || null;
    this.id_retrospective = answer.id_retrospective;
    this.id_question = answer.id_question;
  }

  static async getById(id) {
    let [answer, _] = await db.execute(
      `SELECT * FROM answer WHERE id = ?`,
      [id]
    );
    return new Answer(answer[0]);
  }

  static async getAll() {
    let [answers, _] = await db.execute(`SELECT * FROM answer`);
    return answers.map((answer) => new Answer(answer));
  }

  static verify(answer) {
    // Length of value is less than 400
    if (answer.value?.length > 400)
      throw new Error(
        "El tamaño de la respuesta debe ser menor a 400 caracteres"
      );

    // Value is not empty or null
    if (answer.value?.length == 0 || answer.value?.length == null) 
      throw new Error("Ingresa una respuesta");

    //Uid is a number
    if (isNaN(answer.uid))
      throw new Error("Uid debe ser un número entero");
    if (!answer.uid)
      throw new Error("Uid no debe ser nulo");

    //Id_retrospective is a number
    if (isNaN(answer.id_retrospective))
      throw new Error("id_retrospective debe ser un número entero");
    if (!answer.id_retrospective)
      throw new Error("id_retrospective no debe ser nulo");

    //Id_question is a number
    if (isNaN(answer.id_question))
      throw new Error("id_question debe ser un número entero");
    if (!answer.id_retrospective)
      throw new Error("id_question no debe ser nulo");

    return true;
  }
}

module.exports = Answer;