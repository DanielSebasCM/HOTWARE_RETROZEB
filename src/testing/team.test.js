const Team = require("../models/team.model");

// ------------------ VERIFIER ------------------
test("name is not empty", () => {
  expect(() => {
    new Team({
      name: "",
      active: true,
      creation_date: new Date(),
    });
  }).toThrow("El nombre del equipo no puede estar vacío");
});

test("name is not null", () => {
  expect(() => {
    new Team({
      name: null,
      active: true,
      creation_date: new Date(),
    });
  }).toThrow("El nombre del equipo no puede estar vacío");
});

test("name is not null and length <= 40", () => {
  expect(() => {
    new Team({
      name: "a".repeat(41),
      active: true,
      creation_date: new Date(),
    });
  }).toThrow("El nombre del equipo debe tener máximo 40 caracteres");
});

// ------------------ POST ONE AND GET ONE BY ID ------------------
test("post returns a Team object", async () => {
  const mockTeam = new Team({
    name: "Test team",
  });

  // Insert team
  const res = await mockTeam.post();
  // Verify id created
  expect(res.insertId).toBeGreaterThan(0);
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get team
  const createdTeam = await Team.getById(res.insertId);
  // Verify team
  expect(res.insertId).toEqual(createdTeam.id);
  expect(createdTeam).not.toBeNull();
  expect(createdTeam).toBeDefined();
  expect(createdTeam).toBeInstanceOf(Team);
  expect(createdTeam.name).toEqual(mockTeam.name);
  expect(createdTeam.active).toEqual(1);

  // Verify data
  expect(createdTeam.name.length).toBeLessThan(41);

  // Delete team
  await createdTeam.delete();
});
