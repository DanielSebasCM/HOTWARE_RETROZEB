const Role = require("../models/role.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFIER ------------------
test("role name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Role({
      name: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("role name is smaller than 40 characters", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new Role({
      name: "a".repeat(41),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("role name exists", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Role({});
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("get role by id", async () => {
  const role = await Role.getById(1);
  expect(role.id).toEqual(1);
});

test("get all roles", async () => {
  const roles = await Role.getAll();
  expect(roles.length).toBeGreaterThan(0);
});

test("get all active roles", async () => {
  const roles = await Role.getAllActive();
  roles.forEach((role) => {
    expect(role.active).toEqual(1);
  });
});

test("role successfully created", async () => {
  const mockRole = new Role({ name: "test", active: 1 });

  const res = await mockRole.post();

  const createdRole = await Role.getById(res.insertId);

  expect(res.insertId).toBeDefined();
  expect(res.insertId).not.toBeNull();

  expect(res.insertId).toEqual(createdRole.id);
  expect(mockRole.name).toEqual(createdRole.name);
  expect(mockRole.active).toEqual(createdRole.active);
});

test("role soft delete works", async () => {
  const mockRole = new Role({ name: "test" });
  const res = await mockRole.post();
  await mockRole.delete();
  const deletedRole = await Role.getById(res.insertId);
  expect(deletedRole.active).toEqual(0);
  expect(deletedRole).toEqual(mockRole);
});
