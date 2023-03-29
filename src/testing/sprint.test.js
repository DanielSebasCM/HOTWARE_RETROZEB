const Sprint = require("../models/sprint.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFIER ------------------
test("Sprint name is in range name.length < 40", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new Sprint({
      name: "a".repeat(41),
      start_date: "2021-01-01 00:00:00",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Sprint({
      name: "",
      start_date: "2021-01-01 00:00:00",
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
    validationMessages.isMandatory
  );
  try {
    new Sprint({
      start_date: "2021-01-01 00:00:00",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint has a start date", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "start_date",
    validationMessages.isMandatory
  );
  try {
    new Sprint({
      name: "a".repeat(40),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Sprint start_date is before en_date", () => {
  let thrownError;
  let mock_end_date = new Date("2021-01-01 00:00:00");
  const expectedError = new ValidationError(
    "end_date",
    validationMessages.mustBeAfter(mock_end_date)
  );
  try {
    new Sprint({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date(mock_end_date),
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
