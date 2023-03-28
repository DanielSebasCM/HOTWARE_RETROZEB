const Team = require("../models/team.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFIER ------------------
test("name is not included", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Team({});
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Team({ name: "" });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("name is not null", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Team({ name: null });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("name is not null and length <= 40", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new Team({ name: "a".repeat(41) });
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
  expect(createdTeam).not.toBeNull();
  expect(createdTeam).toBeDefined();
  expect(createdTeam.id).toBe(res.insertId);
  expect(createdTeam.name).toBe(mockTeam.name);
  expect(createdTeam.active).toBe(1);
  expect(createdTeam.creation_date).not.toBeNull();
  expect(createdTeam.creation_date).toBeDefined();
  expect(createdTeam.creation_date).toBeInstanceOf(Date);

  // Soft delete team
  await createdTeam.delete();
  const deletedTeam = await Team.getById(createdTeam.id);

  // Verify team
  expect(deletedTeam).not.toBeNull();
  expect(deletedTeam).toBeDefined();
  expect(deletedTeam.id).toBe(res.insertId);
  expect(deletedTeam.name).toBe(mockTeam.name);
  expect(deletedTeam.active).toBe(0);
  expect(deletedTeam.creation_date).not.toBeNull();
  expect(deletedTeam.creation_date).toBeDefined();
  expect(deletedTeam.creation_date).toBeInstanceOf(Date);

  // activate team
  await deletedTeam.activate();
  const activatedTeam = await Team.getById(deletedTeam.id);

  // Verify team
  expect(activatedTeam).not.toBeNull();
  expect(activatedTeam).toBeDefined();
  expect(activatedTeam.id).toBe(res.insertId);
  expect(activatedTeam.name).toBe(mockTeam.name);
  expect(activatedTeam.active).toBe(1);
  expect(activatedTeam.creation_date).not.toBeNull();
  expect(activatedTeam.creation_date).toBeDefined();
  expect(activatedTeam.creation_date).toBeInstanceOf(Date);
});
