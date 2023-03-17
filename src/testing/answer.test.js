const Answer = require("../models/answer.model");

// ------------------ VERIFIER ------------------
test("value is in range value.length < 400", () => {
  expect(() => {
    new Answer({
      value: "a".repeat(401),
    });
  }).toThrow("El tamaño de la respuesta debe ser menor a 400 caracteres");
});

test("value is not empty", () => {
  expect(() => {
    new Answer({
      value: "",
    });
  }).toThrow("Ingresa una respuesta");
});

test("uid is a valid integer", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: "Esto no sirve",
    });
  }).toThrow("El id del usuario debe ser un número entero");
});

test("uid is not null", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: null,
    });
  }).toThrow("El id del usuario no debe ser nulo");
});

test("uid is not empty", () => {
  expect(() => {
    new Answer({
      value: "a",
    });
  }).toThrow("El id del usuario no debe ser nulo");
});

test("id_question is a valid integer", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_retrospective: 1,
      id_question: "Esto no sirve",
    });
  }).toThrow("id_question debe ser un número entero");
});

test("id_question is not null", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_retrospective: 1,
      id_question: null,
    });
  }).toThrow("id_question no debe ser nulo");
});

test("id_question is not empty", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_retrospective: 1,
    });
  }).toThrow("id_question no debe ser nulo");
});

test("id_retrospective is a valid integer", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_question: 1,
      id_retrospective: "Esto no sirve",
    });
  }).toThrow("id_retrospective debe ser un número entero");
});

test("id_retrospective is not null", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_question: 1,
      id_retrospective: null,
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

test("id_retrospective is not empty", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_question: 1,
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

// ------------------ METHODS ------------------
// post, getById
test("insert and getById a new answer successfully ", async () => {
  const answer = new Answer({
    value: "Default answer",
    uid: 1,
    id_retrospective: 1,
    id_question: 1,
  });

  // Insert answer
  const res = await answer.post();
  // Verify answer
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get answer by id
  const answerById = await Answer.getById(res.insertId);
  // Verify answer
  expect(answerById).not.toBeNull();
  expect(answerById).toBeDefined();
  expect(answerById).toBeInstanceOf(Answer);
  expect(answerById.id).toBe(res.insertId);
  expect(answerById.value).toBe(answer.value);
  expect(answerById.uid).toBe(answer.uid);
  expect(answerById.id_retrospective).toBe(answer.id_retrospective);
  expect(answerById.id_question).toBe(answer.id_question);
});
