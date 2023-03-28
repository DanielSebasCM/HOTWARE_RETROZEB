const Question = require("../models/question.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const questionTypes = require("../utils/constants").enums.questionTypes;

// ------------------ VERIFIER ------------------
test("question length is in range", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.mustBeShorterThan(255)
  );
  try {
    new Question({
      description: "a".repeat(256),
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("question is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new Question({
      description: "",
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("type is not null and of type OPEN, BOOLEAN, SCALE or SELECTION", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "type",
    validationMessages.mustBeEnum(questionTypes)
  );
  try {
    new Question({
      description: "a".repeat(255),
      type: "INVALID",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Option is SELECTION and Option is not null and length > 1", () => {
  let thrownError;
  let expectedError = new ValidationError(
    "option",
    validationMessages.isMandatory
  );
  try {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);

  expectedError = new ValidationError(
    "options",
    validationMessages.mustBeLongerThan(2)
  );

  try {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: [],
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Option is SELECTION and Option is not null and length < 25 && length > 0", () => {
  let thrownError;
  let expectedError = new ValidationError(
    "option",
    validationMessages.isMandatory
  );

  try {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: [null, "a".repeat(24)],
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);

  expectedError = new ValidationError(
    "options",
    validationMessages.isMandatory
  );
  try {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: ["", "a".repeat(24)],
    });
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toEqual(expectedError);

  expectedError = new ValidationError(
    "options",
    validationMessages.mustBeShorterThan(25)
  );

  try {
    new Question({
      description: "a".repeat(255),
      type: "SELECTION",
      options: ["a".repeat(26), "a".repeat(24)],
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// ---------------- CU05: Registrar pregunta ----------------
test("question inserted, queried and deactivated successfully", async () => {
  // Mock question
  const mockQuestion = new Question({
    description: "¿Cómo te sentiste durante el sprint?",
    type: "OPEN",
  });

  // Insert question
  const res = await mockQuestion.post();
  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get question
  const createdQuestion = await Question.getById(res.insertId);
  // Verify question
  expect(res.insertId).toEqual(createdQuestion.id);
  expect(mockQuestion.description).toEqual(createdQuestion.description);
  expect(mockQuestion.type).toEqual(createdQuestion.type);
  expect(createdQuestion.active).toEqual(1);

  // Soft delete question
  await createdQuestion.delete();

  // Verify question is soft deleted
  const deletedQuestion = await Question.getById(res.insertId);
  expect(deletedQuestion.active).toEqual(0);
});

test("question inserted successfully with options", async () => {
  // Mock question
  const mockQuestion = new Question({
    description: "¿Cómo te sentiste durante el sprint?",
    type: "SELECTION",
    options: ["Muy bien", "Bien", "Regular", "Mal", "Muy mal"],
  });

  // Insert question
  const res = await mockQuestion.post();
  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get question
  const createdQuestion = await Question.getById(res.insertId);
  // Verify question
  expect(res.insertId).toEqual(createdQuestion.id);
  expect(mockQuestion.description).toEqual(createdQuestion.description);
  expect(mockQuestion.type).toEqual(createdQuestion.type);
  expect(createdQuestion.active).toEqual(1);
  // Verify options
  expect(createdQuestion.options).not.toBeNull();
  expect(createdQuestion.options).toBeDefined();
  expect(createdQuestion.options.length).toEqual(5);
  // Verify options are the same
  expect(createdQuestion.options).toContain("Muy bien");
  expect(createdQuestion.options).toContain("Bien");
  expect(createdQuestion.options).toContain("Regular");
  expect(createdQuestion.options).toContain("Mal");
  expect(createdQuestion.options).toContain("Muy mal");
});

test("get all active questions successfully", async () => {
  // Get all active questions
  const questions = await Question.getAllActive();
  questions.forEach((question) => {
    expect(question.active).toEqual(1);
  });
});

test("get all questions successfully", async () => {
  // Get all questions
  const questions = await Question.getAll();
  questions.forEach((question) => {
    expect(question.id).not.toBeNull();
    expect(question.id).toBeDefined();
    expect(question.description).not.toBeNull();
    expect(question.description).toBeDefined();
    expect(question.type).not.toBeNull();
    expect(question.type).toBeDefined();
  });
});
