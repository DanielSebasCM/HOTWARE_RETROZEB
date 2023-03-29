const Issue = require("../models/issue.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const issuePriorities = require("../utils/constants").enums.issuePriorities;
const issueStates = require("../utils/constants").enums.issueStates;

// ------------------ VERIFIER ------------------
test("Issue epic name is not empty", () => {
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

test("Issue epic name length is in range < 40", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "epic_name",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new Issue({
      epic_name: "a".repeat(41),
      id_sprint: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Issue priority is of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST", () => {
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

test("Issue state is of type To Do, En curso, Pull requessts, QA, Blocked, Done", () => {
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
