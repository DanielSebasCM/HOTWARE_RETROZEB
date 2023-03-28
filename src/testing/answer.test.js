const Answer = require("../models/answer.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFIER ------------------
test("value is in range value.length < 400", () => {
  let thrownError;
  const expectedError = ValidationError(
    "value",
    validationMessages.mustBeShorterThan(400)
  );
  try {
    new Answer({
      value: "a".repeat(401),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("value is not empty", () => {
  let thrownError;
  let expectedError = ValidationError("value", validationMessages.isMandatory);
  try {
    new Answer({
      value: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("uid is a valid integer", () => {
  let thrownError;
  let expectedError = ValidationError("uid", validationMessages.mustBeInteger);
  try {
    new Answer({
      value: "a",
      uid: "Esto no sirve",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(error).toEqual(expectedError);
});

test("uid is not null", () => {
  let thrownError;
  let expectedError = ValidationError("uid", validationMessages.mustBeInteger);
  try {
    new Answer({
      value: "a",
      uid: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(error).toEqual(expectedError);
});

test("uid is not empty", () => {
  let thrownError;
  let expectedError = ValidationError("uid", validationMessages.mustBeInteger);
  try {
    new Answer({
      value: "a",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(error).toEqual(expectedError);
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
