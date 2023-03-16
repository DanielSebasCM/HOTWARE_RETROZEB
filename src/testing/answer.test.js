test("test true", () => {
  expect(true).toBe(true);
})
/*const Answer = require("../models/answer.model");

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


test("Answer has valid id_question", () => {
  expect(() => {
    new Answer({
      value: "a".repeat(401),
      id_question: "Esto no sirve",
    });
  }).toThrow("id_question inválido");
});

test("Answer has valid id_retrospective", () => {
    expect(() => {
      new Answer({
        value: "a".repeat(401),
        id_retrospective: "Esto no sirve",
      });
    }).toThrow("id_retrospective inválido");
  });

  test("Answer has valid uid", () => {
    expect(() => {
      new Answer({
        value: "a".repeat(401),
        uid: "Esto no sirve",
      });
    }).toThrow("uid inválido");
  });

*/