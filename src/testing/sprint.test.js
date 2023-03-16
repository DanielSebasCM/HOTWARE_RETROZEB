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
  }).toThrow("Formato de fecha inválido");
});

test("Sprint has a valid end date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start_date: "2021-01-01 00:00:00",
      end_date: "Esto no sirve",
    });
  }).toThrow("Formato de fecha inválido");
});

test("Sprint start_date is before en_date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start_date: "2021-01-01 00:00:00",
      end_date: "2020-01-01 00:00:00",
    });
  }).toThrow("La fecha de inicio debe ser menor a la fecha de fin");
});
