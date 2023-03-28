const db = require("../utils/db");

const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;

class Answer {
  constructor(answer) {
    Answer.verify(answer);

    this.id = answer.id || null;
    this.value = answer.value;
    this.uid = answer.uid;
    this.id_retrospective = answer.id_retrospective;
    this.id_question = answer.id_question;
  }

  static async getById(id) {
    let [answer, _] = await db.execute(`SELECT * FROM answer WHERE id = ?`, [
      id,
    ]);
    return new Answer(answer[0]);
  }

  static async getAll() {
    let [answers, _] = await db.execute(`SELECT * FROM answer`);
    return answers.map((answer) => new Answer(answer));
  }

  static verify(answer) {
    // Length of value is less than 400
    if (answer.value?.length > 400)
      throw new ValidationError(
        "value",
        validationMessages.mustBeShorterThan(400)
      );

    // Value is not empty or null
    if (!answer.value)
      throw new ValidationError("value", validationMessages.isMandatory);

    //Uid is a number
    if (!answer.uid)
      throw new ValidationError("uid", validationMessages.isMandatory);

    //Id_retrospective is a number
    if (!answer.id_retrospective)
      throw new ValidationError(
        "id_retrospective",
        validationMessages.isMandatory
      );

    //Id_question is a number
    if (!answer.id_question)
      throw new ValidationError("id_question", validationMessages.isMandatory);

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO answer (value, uid, id_retrospective, id_question) VALUES (?, ?, ?, ?)`,
      [this.value, this.uid, this.id_retrospective, this.id_question]
    );
    return res;
  }
}

module.exports = Answer;
