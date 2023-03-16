const Retrospective = require("../models/retrospective.model");

// ------------------ VERIFIER ------------------
test("Retrospective name is in range name.length < 40", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(41),
      start: "2021-01-01 00:00:00",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("El tamaño del nombre debe ser menor a 40 caracteres");
});

test("Retrospective name is not empty", () => {
  expect(() => {
    new Retrospective({
      name: "",
      start: "2021-01-01 00:00:00",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre");
});

test("Retrospective has a start date", () => {
  expect(() => {
    new Retrospective({
      start: "2021-01-01 00:00:00",
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
      start: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Formato de fecha inválido");
});

test("Retrospective has a valid end date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start: "2021-01-01 00:00:00",
      end: "Esto no sirve",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("Formato de fecha inválido");
});

test("Retrospective star_date is before end_date", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start: "2021-01-01 00:00:00",
      end: "2021-01-01 00:00:00",
      id_team: 1,
      id_sprint: 1,
    });
  }).toThrow("La fecha de inicio debe ser menor a la fecha de fin");
});

test("Retrospective has a valid state", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start: "2021-01-01 00:00:00",
      end: "2021-01-01 00:00:00",
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
      start: "2021-01-01 00:00:00",
      end: "2021-01-01 00:00:00",
      state: "active",
      id_sprint: 1,
    });
  }).toThrow("Id de equipo inválido");
});

test("Retrospective has an id_sprint", () => {
  expect(() => {
    new Retrospective({
      name: "a".repeat(40),
      start: "2021-01-01 00:00:00",
      end: "2021-01-01 00:00:00",
      state: "active",
      id_team: 1,
    });
  }).toThrow("Id de sprint inválido");
});
