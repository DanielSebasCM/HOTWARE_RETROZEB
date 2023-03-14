const Question = require("../models/question.model");

// ------------------ VERIFIER ------------------
test("question length is in range", () => {
  expect(() => {
    new Question({
      description: "a".repeat(256),
      type: "OPEN",
    });
  }).toThrow("El tamaño de la pregunta debe ser menor a 255 caracteres");
});

test("question is not empty", () => {
  expect(() => {
    new Question({
      description: "",
      type: "OPEN",
    });
  }).toThrow("Ingresa una pregunta");
});

test("type is not null and of type OPEN, BOOLEAN, SCALE or SELECTION", () => {
  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "INVALID",
    });
  }).toThrow("El tipo de pregunta no es válido");
});

test("Option is SELECTION and Option is not null and length > 1", () => {
  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: null,
    });
  }).toThrow("Ingresa al menos dos opciones");

  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: [],
    });
  }).toThrow("Ingresa al menos dos opciones");

  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: ["a".repeat(10)],
    });
  }).toThrow("Ingresa al menos dos opciones");
});

test("Option is SELECTION and Option is not null and length < 25 && length > 0", () => {
  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: [null, "a".repeat(24)],
    });
  }).toThrow("El tamaño de cada opción debe ser mayor a 0 caracteres");

  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: ["", "a".repeat(24)],
    });
  }).toThrow("El tamaño de cada opción debe ser mayor a 0 caracteres");

  expect(() => {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: ["a".repeat(26), "a".repeat(24)],
    });
  }).toThrow("El tamaño de cada opción debe ser menor a 25 caracteres");
});

// ---------------- CU05: Registrar pregunta ----------------
test("question inserted successfully", async () => {
  const mockQuestion = new Question({
    description: "¿Cómo te sentiste durante el sprint?",
    type: "OPEN",
  });

  const res = await mockQuestion.post();
  expect(res.insertId).not.toEqual(null);
  expect(res.insertId).not.toBe(undefined);

  const createdQuestion = await Question.getById(res.insertId);
  expect(res.insertId).toEqual(createdQuestion.id);
  expect(mockQuestion.description).toEqual(createdQuestion.description);
  expect(mockQuestion.type).toEqual(createdQuestion.type);
  expect(createdQuestion.active).toEqual(1);

  // TODO - try add question with options
});
