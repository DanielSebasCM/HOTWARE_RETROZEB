const Team = require("../models/team.model");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const teamNameMaxLength =
  require("../utils/constants").limits.teamNameMaxLength;

// ------------------ VERIFIER ------------------
test("Team id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Team({ id: "a", name: "Default Team" });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Team has a name", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Team({ id: 1 });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Team name is less than ${teamNameMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(teamNameMaxLength)
  );
  try {
    new Team({
      name: "a".repeat(teamNameMaxLength + 1),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});
// ------------------ METHODS ------------------
// getAllActive
test("Get all active teams", async () => {
  // Get all active teams
  const teams = await Team.getAllActive();
  // Verify team
  expect(teams).not.toBeNull();
  expect(teams).toBeDefined();
  expect(teams).toBeInstanceOf(Array);
  expect(teams.length).toBeGreaterThan(0);

  teams.forEach((team) => {
    expect(team.active).toBe(1);
  });
});

// post, getById, delete
test("Team inserted, getById, soft delete and activated succesfully", async () => {
  const mockTeam = new Team({
    name: "Default Team",
  });

  // Insert team
  const res = await mockTeam.post();
  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();
  expect(res.insertId).toBeGreaterThan(0);

  // Get team
  const createdTeam = await Team.getById(res.insertId);
  // Verify team
  expect(createdTeam).toEqual(mockTeam);

  // Soft delete team
  await createdTeam.delete();
  const deletedTeam = await Team.getById(createdTeam.id);

  // Verify team
  expect(deletedTeam).toEqual(createdTeam);

  // activate team
  await deletedTeam.activate();
  const activatedTeam = await Team.getById(deletedTeam.id);

  // Verify team
  expect(activatedTeam).toEqual(deletedTeam);
});
