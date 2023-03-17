const Role = require("../models/role.model");

// ------------------ VERIFIER ------------------
test("role name is not empty", () => {
  expect(() => {
    new Role({
      name: "",
    });
  }).toThrow("Ingresa un nombre");
});

test("role name is smaller than 40 characters", () => {
  expect(() => {
    new Role({
      name: "a".repeat(41),
    });
  }).toThrow("El tamaño del nombre debe ser menor a 40 caracteres");
});

test("role name exists", () => {
  expect(() => {
    new Role({});
  }).toThrow("Ingresa un nombre");
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
  const mockRole = new Role({ name: "test", active: true });

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
