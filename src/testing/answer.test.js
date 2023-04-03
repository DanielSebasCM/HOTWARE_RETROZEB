const Answer = require("../models/answer.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const answerMaxLength = require("../utils/constants").limits.answerMaxLength;

// ------------------ VERIFIER ------------------

test("Answer id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Answer({
      id: "a",
      value: "answer",
      uid: 1,
      id_retrospective: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer has value", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "value",
    validationMessages.isMandatory
  );
  try {
    new Answer({
      uid: 1,
      id_retrospective: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer value is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "value",
    validationMessages.isMandatory
  );
  try {
    new Answer({
      value: "",
      uid: 1,
      id_retrospective: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Answer value is no longer than ${answerMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "value",
    validationMessages.mustBeShorterThan(answerMaxLength)
  );
  try {
    new Answer({
      value: "a".repeat(answerMaxLength + 1),
      uid: 1,
      id_retrospective: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer uid is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "uid",
    validationMessages.mustBeInteger
  );
  try {
    new Answer({
      value: "answer",
      uid: "Not an integer",
      id_retrospective: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer has id_retrospective", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_retrospective",
    validationMessages.isMandatory
  );
  try {
    new Answer({
      value: "answer",
      uid: 1,
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer id_retrospective is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_retrospective",
    validationMessages.mustBeInteger
  );
  try {
    new Answer({
      value: "answer",
      uid: 1,
      id_retrospective: "Not an integer",
      id_question: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer has id_question", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_question",
    validationMessages.isMandatory
  );
  try {
    new Answer({
      value: "answer",
      uid: 1,
      id_retrospective: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Answer id_question is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_question",
    validationMessages.mustBeInteger
  );
  try {
    new Answer({
      value: "answer",
      uid: 1,
      id_retrospective: 1,
      id_question: "Not an integer",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// ------------------ METHODS ------------------
// post, getById
test("insert and getById a new answer successfully ", async () => {
  const mockAnswer = new Answer({
    value: "Default answer",
    uid: 1,
    id_retrospective: 1,
    id_question: 1,
  });

  // Insert answer
  const res = await mockAnswer.post();
  // Verify answer
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get answer by id
  const answerById = await Answer.getById(res.insertId);
  // Verify answer
  expect(answerById).toEqual(mockAnswer);
});
