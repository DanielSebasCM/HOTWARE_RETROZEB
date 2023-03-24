const Issue = require("../models/issue.model");
const Retrospective = require("../models/retrospective.model");

// ------------------ VERIFIER ------------------
test("Retrospective name is in range name.length < 40", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(41),
      start_date: new Date("2021-01-01 00:00:00"),
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("El tamaño del nombre debe ser menor a 40 caracteres");
});

test("Retrospective name is not empty", () => {
  expect(() => {
    new Retrospective({
      name: "",
      start_date: new Date("2021-01-01 00:00:00"),
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre");
});

test("Retrospective has a name", () => {
  expect(() => {
    new Retrospective({
      start_date: new Date("2021-01-01 00:00:00"),
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre");
});

test("Retrospective has a start date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Ingresa una fecha de inicio");
});

test("Retrospective has a valid start date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Fecha debe ser una instancia de Date");
});

test("Retrospective has a valid end date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Fecha debe ser una instancia de Date");
});

test("Retrospective star_date is before end_date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:00"),
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("La fecha de inicio debe ser menor a la fecha de fin");
});

test("Retrospective has a valid state", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:01"),
      state: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Estado inválido");
});

test("Retrospective has an id_team", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:01"),
      id_sprint: 1,
    });
  }).toThrow("Ingresa un id de equipo");
});

test("Retrospective has an id_sprint", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start_date: new Date("2021-01-01 00:00:00"),
      end_date: new Date("2021-01-01 00:00:01"),
      id_team: 1,
    });
  }).toThrow("Ingresa un id de sprint");
});

// ------------------ GETTERS ------------------
test("Retrospective getById", async () => {
  const retrospective = await Retrospective.getById(1);
  expect(retrospective.id).toBe(1);
});

test("Retrospective getAll", async () => {
  await expect(async () => {
    await Retrospective.getAll();
  }).not.toThrow();
});

test("Retrospective getIssues", async () => {
  const retrospective = await Retrospective.getById(1);
  const issues = await retrospective.getIssues();
  expect(issues[0] instanceof Issue).toBe(true);
  for (let issue of issues) {
    expect(issue).toEqual(await Issue.getById(issue.id));
  }
});
