const db = require("../utils/db");

const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const answerMaxLength = require("../utils/constants").limits.answerMaxLength;
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
    let [answer, _] = await db.execute(`SELECT * FROM answer WHERE id = ?`, [
      id,
    ]);

    if (answer.length === 0) return null;
    return new Answer(answer[0]);
  }

  static async getAll() {
    let [answers, _] = await db.execute(`SELECT * FROM answer`);
    return answers.map((answer) => new Answer(answer));
  }

  static verify(answer) {
    // Id
    if (answer.id && !Number.isInteger(answer.id))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // Value
    if (!answer.value)
      throw new ValidationError("value", validationMessages.isMandatory);

    // Length of value
    if (answer.value.length > answerMaxLength)
      throw new ValidationError(
        "value",
        validationMessages.mustBeShorterThan(answerMaxLength)
      );

    // Uid
    if (answer.uid && !Number.isInteger(answer.uid))
      throw new ValidationError("uid", validationMessages.mustBeInteger);

    // Id_retrospective
    if (!answer.id_retrospective)
      throw new ValidationError(
        "id_retrospective",
        validationMessages.isMandatory
      );

    if (!Number.isInteger(answer.id_retrospective))
      throw new ValidationError(
        "id_retrospective",
        validationMessages.mustBeInteger
      );

    // Id_question
    if (!answer.id_question)
      throw new ValidationError("id_question", validationMessages.isMandatory);

    if (!Number.isInteger(answer.id_question))
      throw new ValidationError(
        "id_question",
        validationMessages.mustBeInteger
      );

    return true;
  }

  async post() {
    let [res, _] = await db.execute(
      `INSERT INTO answer (value, uid, id_retrospective, id_question) VALUES (?, ?, ?, ?)`,
      [this.value, this.uid, this.id_retrospective, this.id_question]
    );

    this.id = res.insertId;
    return res;
  }
}

module.exports = Answer;
