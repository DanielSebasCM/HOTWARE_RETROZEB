const Privilege = require("../models/privilege.model");

// ------------------ VERIFIER ------------------
test("privilege name is not empty", () => {
  expect(() => {
    new Privilege({
      name: "",
    });
  }).toThrow("El nombre del privilegio no puede estar vacío");
});

test("privilege is smaller than 40 characters", () => {
  expect(() => {
    new Privilege({
      name: "a".repeat(41),
    });
  }).toThrow("El nombre del privilegio no puede tener más de 40 caracteres");
});

test("privilege name exists", async () => {
  expect(() => {
    new Privilege({});
  }).toThrow("El nombre del privilegio no puede estar vacío");
});

test("privilege get all", async () => {
  expect(await Privilege.getAll()).not.toThrow();
});

test("privilege get by id", async () => {
  const privilege = await Privilege.getById(1);
  expect(privilege.id).toBe(1);
});

test("privilege post", async () => {
  const mockPrivilege = new Privilege({
    name: "test",
  });

  const res = mockPrivilege.post();

  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  const createdPrivilege = await Privilege.getById(res.insertId);
  expect(res.insertId).toEqual(createdPrivilege.id);
});
