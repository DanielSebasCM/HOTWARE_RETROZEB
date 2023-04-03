const Question = require("../models/question.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const questionTypes = require("../utils/constants").enums.questionTypes;
const { questionMaxLength, optionMaxLength } =
  require("../utils/constants").limits;

// ------------------ VERIFIER ------------------
// id
test("Question id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Question({
      id: "1",
      description: "Question",
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question has description", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new Question({
      id: 1,
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question description is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new Question({
      id: 1,
      description: "",
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Question description is shorter than ${questionMaxLength}`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.mustBeShorterThan(questionMaxLength)
  );
  try {
    new Question({
      description: "a".repeat(questionMaxLength + 1),
      type: "OPEN",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question type is of type " + questionTypes, () => {
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

test("Question of type SELECTION has options", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "options",
    validationMessages.isMandatory
  );
  try {
    new Question({
      description: "Question",
      type: "SELECTION",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question of type SELECTION options is an array", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "options",
    validationMessages.mustBeArray
  );
  try {
    new Question({
      description: "Question",
      type: "SELECTION",
      options: "INVALID",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question of type SELECTION options is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "options",
    validationMessages.isMandatory
  );
  try {
    new Question({
      description: "Question",
      type: "SELECTION",
      options: ["", ""],
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Question of type SELECTION has at least 2 options", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "options",
    validationMessages.mustHaveAtLeast(2)
  );
  try {
    new Question({
      description: "Question",
      type: "SELECTION",
      options: ["a"],
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Question of type SELECTION options is shorter than ${optionMaxLength}`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "options",
    validationMessages.mustBeShorterThan(optionMaxLength)
  );
  try {
    new Question({
      description: "Question",
      type: "SELECTION",
      options: ["a".repeat(optionMaxLength + 1), "a".repeat(optionMaxLength)],
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
  expect(createdQuestion).toEqual(mockQuestion);

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
  expect(createdQuestion).toEqual(mockQuestion);
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
