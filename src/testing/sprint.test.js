const Sprint = require("../models/sprint.model");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const sprintMaxLength = require("../utils/constants").limits.sprintMaxLength;
// ------------------ VERIFIER ------------------
test("Sprint id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Sprint({
      id: "a",
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      id_project: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint has a name", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeString
  );
  try {
    new Sprint({
      id: 1,
      start_date: new Date("2021-01-01 00:00:00"),
      id_project: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Sprint name must be less than ${sprintMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(sprintMaxLength)
  );
  try {
    new Sprint({
      name: "a".repeat(sprintMaxLength + 1),
      start_date: new Date("2021-01-01 00:00:00"),
      id_project: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint start_date is a date", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "start_date",
    validationMessages.mustBeDate
  );
  try {
    new Sprint({
      name: "a".repeat(40),
      start_date: "a",
      id_project: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint end_date is a date", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "end_date",
    validationMessages.mustBeDate
  );
  try {
    new Sprint({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: "a",
      id_project: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint id_project is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_project",
    validationMessages.mustBeInteger
  );
  try {
    new Sprint({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:00"),
      id_project: "a",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// ------------------ Getter ------------------

test("Sprint getById", async () => {
  const sprint = await Sprint.getById(1);
  expect(sprint.id).toBe(1);
});

test("Sprint getAll", async () => {
  await expect(async () => {
    await Sprint.getAll();
  }).not.toThrow();
});

// ------------------ POST ------------------

test("Sprint post", async () => {
  // Create mock Issue
  const now = new Date();
  now.setMilliseconds(0, 0, 0);
  const mockSprint = new Sprint({
    name: "Test",
    start_date: now,
  });

  // Insert issue
  const res = await mockSprint.post();

  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // get issue
  const createdSprint = await Sprint.getById(res.insertId);

  // Verify Issue
  expect(createdSprint).toEqual(mockSprint);
});
