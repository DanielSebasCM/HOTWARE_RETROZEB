const Privilege = require("../models/privilege.model");

test("privilege get all", async () => {
  expect(await Privilege.getAll()).not.toThrow();
});

test("privilege get by id", async () => {
  const privilege = await Privilege.getById(1);
  expect(privilege.id).toBe(1);
});
