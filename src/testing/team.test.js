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

test("active is not null", () => {
  expect(() => {
    new Team({
      name: "a".repeat(40),
      active: null,
      creation_date: new Date(),
    });
  }).toThrow("El estado 'activo' del equipo no puede estar vacío");
});

test("active is different than 0 or 1", () => {
  expect(() => {
    new Team({
      name: "a".repeat(40),
      active: 2,
      creation_date: new Date(),
    });
  }).toThrow("El estado 'activo' del equipo debe ser 0 o 1");
});

test("creation_date is not null", () => {
  expect(() => {
    new Team({
      name: "a".repeat(40),
      active: true,
      creation_date: null,
    });
  }).toThrow("La fecha de creación del equipo no puede estar vacía");
});

