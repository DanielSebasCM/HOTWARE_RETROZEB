const Sprint = require("../models/sprint.model");

// ------------------ VERIFIER ------------------
test("Sprint name is in range name.length < 40", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(41),
      start_date: "2021-01-01 00:00:00",
    });
  }).toThrow("El tamaño del nombre debe ser menor a 40 caracteres");
});

test("Sprint name is not empty", () => {
  expect(() => {
    new Sprint({
      name: "",
      start_date: "2021-01-01 00:00:00",
    });
  }).toThrow("Ingresa un nombre");
});

test("Sprint has a name", () => {
  expect(() => {
    new Sprint({
      start_date: "2021-01-01 00:00:00",
    });
  }).toThrow("Ingresa un nombre");
});

test("Sprint has a start date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
    });
  }).toThrow("Ingresa una fecha de inicio");
});

test("Sprint has a valid start date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start_date: "Esto no sirve",
    });
  }).toThrow("Fecha debe ser una instancia de Date");
});

test("Sprint has a valid end date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start_date: "2021-01-01 00:00:00",
      end_date: "Esto no sirve",
    });
  }).toThrow("Fecha debe ser una instancia de Date");
});

test("Sprint start_date is before en_date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:00"),
    });
  }).toThrow("La fecha de inicio debe ser menor a la fecha de fin");
});

// ------------------ Getter ------------------

test("Sprint getById", async () => {
  const sprint = await Sprint.getById(1);
  expect(sprint.id).toBe(1);
});

test("Sprint getAll", async () => {
  await expect(async () => {
    await Sprint.getAll();
  }).not.toThrow();
});

// ------------------ POST ------------------

test("Sprint post", async () => {
  // Create mock Issue
  const mockSprint = new Issue({
    name: "Test",
    start_date: new Date(),
  });

  // Insert issue
  const res = await mockSprint.post();

  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // get issue
  const createdSprint = await Sprint.getById(res.insertId);

  // Verify Issue
  expect(createdSprint).toEqual(mockSprint);
});
