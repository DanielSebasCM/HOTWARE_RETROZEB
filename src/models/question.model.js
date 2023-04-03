const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const questionTypes = require("../utils/constants").enums.questionTypes;
const { questionMaxLength, optionMaxLength } =
  require("../utils/constants").limits;
class Question {
  constructor(question) {
    Question.verify(question);

    this.id = question.id || null;
    this.description = question.description;
    this.type = question.type;
    this.active = question.active != 0 ? 1 : 0;

    if (this.type == "SELECTION") {
      this.options = question.options;
    }
  }

  static async getById(id) {
    let [question, _] = await db.execute(
      `SELECT * FROM question WHERE id = ?`,
      [id]
    );

    if (question[0].type == "SELECTION") {
      let [options, _] = await db.execute(
        "SELECT description FROM `option` WHERE id_question = ? ORDER BY id",
        [id]
      );
      question[0].options = options.map((option) => option.description);
    }

    return new Question(question[0]);
  }

  static async getAll() {
    let [questions, _] = await db.execute(`SELECT * FROM question`);

    for (let question of questions) {
      if (question.type == "SELECTION") {
        let [options, _] = await db.execute(
          "SELECT description FROM `option` WHERE id_question = ? ORDER BY id",
          [question.id]
        );
        question.options = options.map((option) => option.description);
      }
    }

    return questions.map((question) => new Question(question));
  }

  static async getAllActive() {
    let [questions, _] = await db.execute(
      `SELECT * FROM question WHERE active = 1`
    );

    for (let question of questions) {
      if (question.type == "SELECTION") {
        let [options, _] = await db.execute(
          "SELECT description FROM `option` WHERE id_question = ? ORDER BY id",
          [question.id]
        );
        question.options = options.map((option) => option.description);
      }
    }

    return questions.map((question) => new Question(question));
  }

  async getOptionId(option) {
    const [optionId, _] = await db.execute(
      "SELECT id FROM `option` WHERE id_question = ? AND description = ?",
      [this.id, option]
    );

    return optionId[0].id;
  }

  static verify(question) {
    // Id is an integer
    if (question.id && !Number.isInteger(Number(question.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // description
    if (!question.description)
      throw new ValidationError("description", validationMessages.isMandatory);

    // Length of description is less than 255
    if (question.description.length > questionMaxLength)
      throw new ValidationError(
        "description",
        validationMessages.mustBeShorterThan(questionMaxLength)
      );

    // Type is not null and of type OPEN, BOOLEAN, SCALE or SELECTION
    if (question.type && !questionTypes.includes(question.type))
      throw new ValidationError(
        "options",
        validationMessages.mustBeEnum(questionTypes)
      );

    // Option is SELECTION and Option is not null and length > 1
    if (question.type === "SELECTION") {
      if (!question.options)
        throw new ValidationError("options", validationMessages.isMandatory);

      if (!(question.options instanceof Array))
        throw new ValidationError("options", validationMessages.mustBeArray);

      if (question.options.length < 2)
        throw new ValidationError(
          "options",
          validationMessages.mustHaveAtLeast(2)
        );

      // Option is SELECTION and Option is not null and length < 25 && length > 0
      question.options.forEach((option) => {
        if (!option)
          throw new ValidationError("option", validationMessages.isMandatory);
        if (option.length > optionMaxLength)
          throw new ValidationError(
            "option",
            validationMessages.mustBeShorterThan(optionMaxLength)
          );
        if (option.length == 0)
          throw new ValidationError("option", validationMessages.isMandatory);
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
    this.id = res.insertId;

    if (this.type === "SELECTION") {
      for (let option of this.options) {
        await db.execute(
          "INSERT INTO `option` (id_question, description) VALUES (?, ?)",
          [this.id, option]
        );
      }
    }
    return res;
  }

  async delete() {
    return await db.execute(`UPDATE question SET active = 0 WHERE id = ?`, [
      this.id,
    ]);
  }
}

module.exports = Question;
