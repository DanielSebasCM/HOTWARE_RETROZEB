const Role = require("../models/role.model");

// ------------------ VERIFIER ------------------
test("role name is not empty", () => {
  expect(() => {
    new Role({
      name: "",
    });
  }).toThrow("Ingresa un nombre");
});

test("role name is not null", () => {
  expect(() => {
    new Role({
      name: null,
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

test("role active is boolean", () => {
  expect(() => {
    new Role({
      name: "test",
      active: "true",
    });
  }).toThrow("El estado del rol debe ser booleano");
});

test("role successfully created", async () => {
  const mockRole = new Role({ name: "test", active: true });

  const res = await mockRole.post();

  const createdRole = await Role.getById(res.insertId);

  expect(res.insertId).toEqual(createdRole.id);
  expect(mockRole.name).toEqual(createdRole.name);
  expect(mockRole.active).toEqual(createdRole.active);
});
