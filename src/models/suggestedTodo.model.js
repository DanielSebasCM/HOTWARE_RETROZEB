const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const actionableStates = require("../utils/constants").enums.actionableStates;
const { toDoTitleMaxLength, toDoDescriptionMaxLength } =
  require("../utils/constants").limits;
class SuggestedTodo {
  constructor(suggested_todo) {
    SuggestedTodo.verify(suggested_todo);

    this.id = suggested_todo.id || null;
    this.title = suggested_todo.title;
    this.description = suggested_todo.description;
    this.state = suggested_todo.state || "PENDING";
    this.id_user_author = suggested_todo.id_user_author;
  }

  static async getById(id) {
    let [suggested_todo, _] = await db.execute(
      `SELECT * FROM suggested_todo WHERE id = ?`,
      [id]
    );

    if (suggested_todo.length === 0) return null;
    return new SuggestedTodo(suggested_todo[0]);
  }

  static async getAll() {
    let [suggested_todo_, _] = await db.execute(`SELECT * FROM suggested_todo`);
    return suggested_todo_.map(
      (suggested_todo) => new SuggestedTodo(suggested_todo)
    );
  }

  static async getAllByState(state) {
    let [suggested_todo_, _] = await db.execute(
      `SELECT * FROM suggested_todo WHERE state = ?`,
      [state]
    );
    return suggested_todo_.map(
      (suggested_todo) => new SuggestedTodo(suggested_todo)
    );
  }

  static verify(suggested_todo) {
    // id
    if (suggested_todo.id && !Number.isInteger(Number(suggested_todo.id)))
      throw new ValidationError("id", validationMessages.mustBeInteger);

    // title
    if (!suggested_todo.title)
      throw new ValidationError("title", validationMessages.isMandatory);

    if (suggested_todo.title.length > toDoTitleMaxLength)
      throw new ValidationError(
        "title",
        validationMessages.mustBeShorterThan(toDoTitleMaxLength)
      );

    if (suggested_todo.description.length > toDoDescriptionMaxLength)
      throw new ValidationError(
        "description",
        validationMessages.mustBeShorterThan(toDoDescriptionMaxLength)
      );

    // state
    if (
      suggested_todo.state &&
      !actionableStates.includes(suggested_todo.state)
    )
      throw new ValidationError(
        "state",
        validationMessages.mustBeEnum(actionableStates)
      );

    // id_user_author
    if (!suggested_todo.id_user_author)
      throw new ValidationError(
        "id_user_author",
        validationMessages.isMandatory
      );

    if (!Number.isInteger(Number(suggested_todo.id_user_author)))
      throw new ValidationError(
        "id_user_author",
        validationMessages.mustBeInteger
      );

    return true;
  }

  async post() {
    let [suggested_todo, _] = await db.execute(
      `INSERT INTO suggested_todo (title, description, id_user_author) VALUES (?, ?, ?)`,
      [this.title, this.description, this.id_user_author]
    );

    this.id = suggested_todo.insertId;
    return suggested_todo;
  }

  async accept() {
    let [suggested_todo, _] = await db.execute(
      `UPDATE suggested_todo SET state = 'ACCEPTED' WHERE id = ?`,
      [this.id]
    );

    this.state = "ACCEPTED";
    return suggested_todo;
  }

  async reject() {
    let [suggested_todo, _] = await db.execute(
      `UPDATE suggested_todo SET state = 'REJECTED' WHERE id = ?`,
      [this.id]
    );

    this.state = "REJECTED";
    return suggested_todo;
  }
}

module.exports = SuggestedTodo;
