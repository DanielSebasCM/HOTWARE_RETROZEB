const db = require("../utils/db");

class SuggestedTodo {
  constructor(suggested_todo) {
    SuggestedTodo.verify(suggested_todo);

    this.id = suggested_todo.id || 1;
    this.title = suggested_todo.title;
    this.description = suggested_todo.description;
    this.state = suggested_todo.state || 'PENDING';
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
    return suggested_todo_.map((suggested_todo) => new SuggestedTodo(suggested_todo));
  }

  static async getAllState() {
    let [suggested_todo_, _] = await db.execute(
      `SELECT * FROM suggested_todo WHERE state = ('PENDING', 'ACCEPTED', 'REJECTED')`
    );
    return suggested_todo_.map((suggested_todo) => new SuggestedTodo(suggested_todo));
  }

//-----------------------------------------------------------------------------------------
  static verify(suggested_todo) {
    // Length of title is less than 40
    if (suggested_todo.title?.length > 40)
      throw new Error(
        "El tamaño del titulo debe ser menor a 40 caracteres"
      );

    // Title is not empty or null
    if (suggested_todo.title?.length == 0 || suggested_todo.title == null)
      throw new Error("Ingresa un titulo para este accionable");

    // Length of description is less than 255 
    if (suggested_todo.description?.length > 255)
      throw new Error(
        "La descripcion debe ser menor a 255 caracteres"
      );

    // Description is not empty or null
    if (suggested_todo.description?.length == 0 || suggested_todo.description == null)
      throw new Error("Ingresa una descripcion");

    //State is of type "PENDING", "ACCEPTED", "REJECTED"
    const options = ["PENDING", "ACCEPTED", "REJECTED"];
    if (!options.includes(suggested_todo.state))
      throw new Error("El tipo de estado no es válido");
    
    //State is not null
    if(suggested_todo.state == null)
      throw new Error("El tipo de estado no es válido");
    
    //Id_user_author is a number
    if (isNaN(suggested_todo.id_user_author))
      throw new Error("id_user_author debe ser un número entero");

    //Id_retrospective is a number
    if (isNaN(suggested_todo.id_retrospective))
     throw new Error("id_retrospective debe ser un número entero");

    return true;
  }
  //-------------------------------------------------------------------------------------------------

}

module.exports = SuggestedTodo;