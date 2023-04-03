const Issue = require("../models/issue.model");
const Retrospective = require("../models/retrospective.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const retrospectiveStates =
  require("../utils/constants").enums.retrospectiveStates;
const retrospectiveMaxLength =
  require("../utils/constants").limits.retrospectiveMaxLength;

// ------------------ VERIFIER ------------------
test("Restrospective id is an integer", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Retrospective({
      id: "1",
      name: "Retrospective",
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has a name", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Retrospective({
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective name is not empty", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Retrospective({
      name: "",
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Retrospective name is shorter than ${retrospectiveMaxLength} characters`, () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(retrospectiveMaxLength)
  );
  try {
    new Retrospective({
      name: "a".repeat(retrospectiveMaxLength + 1),
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has a valid start date", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "start_date",
    validationMessages.mustBeDate
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      start_date: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has a valid end date", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "end_date",
    validationMessages.mustBeDate
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has a valid state", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "state",
    validationMessages.mustBeEnum(retrospectiveStates)
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      id_team: 1,
      id_sprint: 1,
      state: "Esto no sirve",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has an id_team", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "id_team",
    validationMessages.isMandatory
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective id_team is an integer", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "id_team",
    validationMessages.mustBeInteger
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      id_team: "1",
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective has an id_sprint", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "id_sprint",
    validationMessages.isMandatory
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      id_team: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Retrospective id_sprint is an integer", () => {
  let thrownError = null;
  let expectedError = new ValidationError(
    "id_sprint",
    validationMessages.mustBeInteger
  );
  try {
    new Retrospective({
      name: "a".repeat(40),
      id_team: 1,
      id_sprint: "1",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// ------------------ GETTERS ------------------
test("Retrospective getById", async () => {
  const retrospective = await Retrospective.getById(1);
  expect(retrospective.id).toBe(1);
});

test("Retrospective getAll", async () => {
  await expect(async () => {
    await Retrospective.getAll();
  }).not.toThrow();
});

test("Retrospective getIssues", async () => {
  const retrospective = await Retrospective.getById(1);
  const issues = await retrospective.getIssues();
  expect(issues[0] instanceof Issue).toBe(true);
  for (let issue of issues) {
    expect(issue).toEqual(await Issue.getById(issue.id));
  }
});
