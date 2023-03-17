const Issue = require("../models/issue.model");

// ------------------ VERIFIER ------------------
test("Issue epic name is not empty", () => {
  expect(() => {
    new Issue({
      epic_name: "",
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre de epic");
});

test("Issue epic name length is in range < 40", () => {
  expect(() => {
    new Issue({
      epic_name: "a".repeat(41),
      id_sprint: 1,
    });
  }).toThrow("El tamaño del nombre de epic debe ser menor a 40 caracteres");
});

test("Issue has an epic name", () => {
  expect(() => {
    new Issue({
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre de epic");
});

test("Issue priority is of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST", () => {
  expect(() => {
    new Issue({
      epic_name: "a".repeat(40),
      priority: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("La prioridad no es válida");
});

test("Issue state is of type To Do, En curso, Pull requessts, QA, Blocked, Done", () => {
  expect(() => {
    new Issue({
      epic_name: "a".repeat(40),
      state: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("El estado no es válido");
});

test("Issue has id_sprint", () => {
  expect(() => {
    new Issue({
      epic_name: "a".repeat(40),
    });
  }).toThrow("id_sprint es obligatorio");
});
