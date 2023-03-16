const SuggestedTodo = require("../models/suggestedTodo.model");

// ------------------ VERIFIER ------------------
test("SuggestedTodo title is in range title.length < 40", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(41),
    });
  }).toThrow("El tamaño del titulo debe ser menor a 40 caracteres");
});

test("SuggestedTodo title is not empty", () => {
  expect(() => {
    new SuggestedTodo({
      title: "",
    });
  }).toThrow("Ingresa un titulo");
});

test("SuggestedTodo title is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: null,
    });
  }).toThrow("Ingresa un titulo");
});

/*test("SuggestedTodo title is not undefined", () => {
  expect(() => {
    new SuggestedTodo({
      title: -1
    });
  }).toThrow("Ingresa un titulo");
});*/

test("SuggestedTodo description is in range description.length < 255", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: "a".repeat(256),
    });
  }).toThrow("La descripcion debe ser menor a 255 caracteres");
});

test("SuggestedTodo description is not empty", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: "",
    });
  }).toThrow("Ingresa una descripcion");
});

test("SuggestedTodo description is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: null,
    });
  }).toThrow("Ingresa una descripcion");
});

test("SuggestedTodo has id_user_author not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
      id_user_author: null,
    });
  }).toThrow("id_user_author no debe ser nulo");
});

test("id_user_author is number", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
      id_user_author: "Esto no sirve",
    });
  }).toThrow("id_user_author debe ser un número entero");
});

test("SuggestedTodo has id_retrospective not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: null,
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

test("id_retrospective is number", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: "Esto no sirve",
    });
  }).toThrow("id_retrospective debe ser un número entero");
});

//-------------------------------
// Get question
test("get SuggestedTodo by id", async () => {
  const createdST = await SuggestedTodo.getById(1);
  // Verify question
  expect(createdST.id).toEqual(1);
  expect(createdST.title).toBeDefined();
  expect(createdST.title.length).toBeGreaterThan(0);
});
