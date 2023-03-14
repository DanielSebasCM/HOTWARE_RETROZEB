const Sprint = require("../models/sprint.model");

// ------------------ VERIFIER ------------------
test("Sprint name is in range name.length < 40", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(41),
      start: "2021-01-01 00:00:00",
    });
  }).toThrow("El tamaño del nombre debe ser menor a 40 caracteres");
});

test("Sprint name is not empty", () => {
  expect(() => {
    new Sprint({
      name: "",
      start: "2021-01-01 00:00:00",
    });
  }).toThrow("Ingresa un nombre");
});

test("Sprint has a start date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start: null,
    });
  }).toThrow("Ingresa una fecha de inicio");
});

test("Sprint has a valid start date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start: "Esto no sirve",
    });
  }).toThrow("Formato de fecha inválido");
});

test("Sprint has a valid end date", () => {
  expect(() => {
    new Sprint({
      name: "a".repeat(40),
      start: "2021-01-01 00:00:00",
      end: "Esto no sirve",
    });
  }).toThrow("Formato de fecha inválido");
});
