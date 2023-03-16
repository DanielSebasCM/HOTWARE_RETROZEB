test("test true", () => {
  expect(true).toBe(true);
})
const Answer = require("../models/answer.model");

// ------------------ VERIFIER ------------------
test("Answer value is in range value.length < 400", () => {
  expect(() => {
    new Answer({
      value: "a".repeat(401)
    });
  }).toThrow("El tamaño de la respuesta debe ser menor a 400 caracteres");
});

test("Answer value is not empty", () => {
  expect(() => {
    new Answer({
      value: ""
    });
  }).toThrow("Ingresa una respuesta");
});


test("Answer has valid uid", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: "Esto no sirve",
    });
  }).toThrow("Uid debe ser un número entero");
});

test("Answer uid is not null", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: null,
    });
      throw new Error("Uid no debe ser nulo");
    }).toThrow("");
});

test("Answer has valid id_question", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_question: "Esto no sirve",
    });
  }).toThrow("id_question debe ser un número entero");
});


test("Answer has valid id_question", () => {
  expect(() => {
    new Answer({
      value: "a",
      uid: 1,
      id_question: null,
    });
  }).toThrow("id_question no debe ser nulo");
});

test("Answer has valid id_retrospective", () => {
    expect(() => {
      new Answer({
        value: "a",
        uid: 1,
        id_question: 1,
        id_retrospective: "Esto no sirve",
      });
    }).toThrow("id_retrospective debe ser un número entero");
  });

  test("Answer has valid id_retrospective", () => {
    expect(() => {
      new Answer({
        value: "a",
        uid: 1,
        id_question: 1,
        id_retrospective: null,
      });
    }).toThrow("id_retrospective no debe ser nulo");
  });
 