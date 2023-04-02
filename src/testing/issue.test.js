const Issue = require("../models/issue.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const issuePriorities = require("../utils/constants").enums.issuePriorities;
const issueStates = require("../utils/constants").enums.issueStates;
const issueTypes = require("../utils/constants").enums.issueTypes;
const epicsNameMaxLength =
  require("../utils/constants").limits.epicsNameMaxLength;

// ------------------ VERIFIER ------------------
// Id
test("Issue id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Issue({
      id: "1",
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// Id_jira
test("Issue id_jira is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_jira",
    validationMessages.mustBeInteger
  );
  try {
    new Issue({
      id_jira: "1",
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// Epic_name
test("Issue epic_name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "epic_name",
    validationMessages.isMandatory
  );
  try {
    new Issue({
      epic_name: "",
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Issue epic_name is not longer than ${epicsNameMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "epic_name",
    validationMessages.mustBeShorterThan(epicsNameMaxLength)
  );
  try {
    new Issue({
      epic_name: "a".repeat(epicsNameMaxLength + 1),
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// story_points
test("Issue story_points is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "story_points",
    validationMessages.mustBeInteger
  );
  try {
    new Issue({
      story_points: "1",
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// priority
test("Issue priority is of type " + issuePriorities, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "priority",
    validationMessages.mustBeEnum(issuePriorities)
  );
  try {
    new Issue({
      epic_name: "a",
      id_sprint: 1,
      priority: "INVALID",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// state
test("Issue state is of type " + issueStates, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "state",
    validationMessages.mustBeEnum(issueStates)
  );
  try {
    new Issue({
      epic_name: "a",
      id_sprint: 1,
      priority: "Highest",
      state: "INVALID",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// type
test("Issue type is of type " + issueTypes, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "type",
    validationMessages.mustBeEnum(issueTypes)
  );
  try {
    new Issue({
      epic_name: "a",
      id_sprint: 1,
      priority: "Highest",
      state: "To Do",
      type: "INVALID",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// uid
test("Issue uid is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "uid",
    validationMessages.mustBeInteger
  );
  try {
    new Issue({
      epic_name: "a",
      id_sprint: 1,
      priority: "Highest",
      state: "To Do",
      type: "Story",
      uid: "1",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// id_sprint

test("Issue has id_sprint", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_sprint",
    validationMessages.isMandatory
  );
  try {
    new Issue({
      epic_name: "a",
      priority: "Highest",
      state: "To Do",
      type: "Story",
      uid: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Issue id_sprint is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_sprint",
    validationMessages.mustBeInteger
  );
  try {
    new Issue({
      epic_name: "a",
      id_sprint: "1",
      priority: "Highest",
      state: "To Do",
      type: "Story",
      uid: 1,
    });
  } catch (error) {
    thrownError = error;
    expect(thrownError).toEqual(expectedError);
  }
});

// ------------------ GETTER ------------------
test("Issue getById", async () => {
  const mockIssue = await Issue.getById(52);
  expect(mockIssue.id).toEqual(52);
});

test("Issue getAll", async () => {
  await expect(async () => {
    await Issue.getAll();
  }).not.toThrow();
});

// ------------------- Post -------------------
test("Issue post", async () => {
  // Create mock Issue
  const mockIssue = new Issue({
    epic_name: "Test",
    id_sprint: 1,
    labels: ["test", "test2"],
  });

  // Insert issue
  const res = await mockIssue.post();

  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // get issue
  const createdIssue = await Issue.getById(res.insertId);

  // Verify Issue
  expect(createdIssue).toEqual(mockIssue);
});
