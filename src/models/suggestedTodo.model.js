const db = require("../utils/db");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const actionableStates = require("../utils/constants").enums.actionableStates;

class SuggestedTodo {
  constructor(suggested_todo) {
    SuggestedTodo.verify(suggested_todo);

    this.id = suggested_todo.id || null;
    this.title = suggested_todo.title;
    this.description = suggested_todo.description;
    this.state = suggested_todo.state || "PENDING";
    this.id_user_author = suggested_todo.id_user_author;
    this.id_retrospective = suggested_todo.id_retrospective;
  }

  static async getById(id) {
    let [suggested_todo, _] = await db.execute(
      `SELECT * FROM suggested_todo WHERE id = ?`,
      [id]
    );

    return new SuggestedTodo(suggested_todo[0]);
  }

  static async getAll() {
    let [suggested_todo_, _] = await db.execute(`SELECT * FROM suggested_todo`);
    return suggested_todo_.map(
      (suggested_todo) => new SuggestedTodo(suggested_todo)
    );
  }

  static async getAllState(state) {
    let [suggested_todo_, _] = await db.execute(
      `SELECT * FROM suggested_todo WHERE state = ?`,
      [state]
    );
    return suggested_todo_.map(
      (suggested_todo) => new SuggestedTodo(suggested_todo)
    );
  }

  static verify(suggested_todo) {
    // Length of title is less than 40
    if (suggested_todo.title?.length > 40)
      throw new ValidationError(
        "title",
        validationMessages.mustBeShorterThan(40)
      );

    // Title is not empty or null
    if (
      suggested_todo.title?.length == 0 ||
      suggested_todo.title == null ||
      !suggested_todo.title
    )
      throw new ValidationError("title", validationMessages.isMandatory);

    // Length of description is less than 255
    if (suggested_todo.description?.length > 255)
      throw new ValidationError(
        "description",
        validationMessages.mustBeShorterThan(255)
      );

    // Description is not empty or null
    if (
      suggested_todo.description?.length == 0 ||
      suggested_todo.description == null ||
      !suggested_todo.description
    )
      throw new ValidationError("description", validationMessages.isMandatory);

    //State is of type "PENDING", "ACCEPTED", "REJECTED"
    if (suggested_todo.state) {
      if (!actionableStates.includes(suggested_todo.state))
        throw new ValidationError(
          "state",
          validationMessages.mustBeEnum(actionableStates)
        );
    }

    //State is not null
    if (suggested_todo.state == null || !suggested_todo.state)
      throw new ValidationError("title", validationMessages.isMandatory);

    if (!suggested_todo.id_user_author)
      throw new ValidationError(
        "id_user_author",
        validationMessages.isMandatory
      );

    if (!suggested_todo.id_retrospective)
      throw new ValidationError(
        "id_retrospective",
        validationMessages.isMandatory
      );

    return true;
  }

  async post() {
    let [suggested_todo, _] = await db.execute(
      `INSERT INTO suggested_todo (title, description, id_user_author, id_retrospective) VALUES (?, ?, ?, ?)`,
      [this.title, this.description, this.id_user_author, this.id_retrospective]
    );

    return suggested_todo;
  }

  async accept() {
    let [suggested_todo, _] = await db.execute(
      `UPDATE suggested_todo SET state = 'ACCEPTED' WHERE id = ?`,
      [this.id]
    );

    return suggested_todo;
  }

  async reject() {
    let [suggested_todo, _] = await db.execute(
      `UPDATE suggested_todo SET state = 'REJECTED' WHERE id = ?`,
      [this.id]
    );

    return suggested_todo;
  }
}

module.exports = SuggestedTodo;
