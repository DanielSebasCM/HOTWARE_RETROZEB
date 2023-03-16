const db = require("../utils/db");

class Answer {
  constructor(answer) {
    Answer.verify(answer);

    this.id = answer.id;
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
        "Tu respuesta excede el número de caracteres permitidos."
      );

    // Value is not empty
    if (answer.value?.length == 0)
      throw new Error("No puedes dejar estar pregunta sin contestar.");

    return true;
  }


}

module.exports = Answer;