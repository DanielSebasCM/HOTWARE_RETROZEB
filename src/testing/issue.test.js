const Issue = require("../models/issue.model");

// ------------------ VERIFIER ------------------
test("Issue epic name is not empty", () => {
  expect(() => {
    new Issue({
      epicName: "",
      priority: "LOW",
      id_sprint: 1,
    });
  }).toThrow("Ingresa un nombre de epic");
});

test("Issue epic name length is in range < 40", () => {
  expect(() => {
    new Issue({
      epicName: "a".repeat(41),
      story_points: 1,
      priority: "LOW",
      id_sprint: 1,
    });
  }).toThrow("El tamaño del nombre de epic debe ser menor a 40 caracteres");
});

test("Issue priority is of type LOWEST, LOW, MEDIUM, HIGH, HIGHEST", () => {
  expect(() => {
    new Issue({
      epicName: "a".repeat(40),
      story_points: 5,
      priority: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("La prioridad no es válida");
});

test("Default priority is MEDIUM", () => {
  const issue = new Issue({
    epicName: "a".repeat(40),
    story_points: 5,
    id_sprint: 1,
  });
  expect(issue.priority).toBe("MEDIUM");
});

test("Issue state is of type To Do, En curso, Pull requessts, QA, Blocked, Done", () => {
  expect(() => {
    new Issue({
      epicName: "a".repeat(40),
      story_points: 5,
      priority: "LOW",
      state: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("El estado no es válido");
});

test("Default state is To Do", () => {
  const issue = new Issue({
    epicName: "a".repeat(40),
    story_points: 5,
    id_sprint: 1,
  });
  expect(issue.state).toBe("To Do");
});

test("Issue uid is valid", () => {
  expect(() => {
    new Issue({
      epicName: "a".repeat(40),
      story_points: 5,
      priority: "LOW",
      uid: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("El uid no es válido");
});

test("Issue id_sprint exists and is valid", () => {
  expect(() => {
    new Issue({
      epicName: "a".repeat(40),
      story_points: 5,
      id_sprint: 1,
    });
  }).toThrow("id_sprint es obligatorio");

  expect(() => {
    new Issue({
      epicName: "a".repeat(40),
      story_points: 5,
      id_sprint: "INVALID",
      id_sprint: 1,
    });
  }).toThrow("El id del sprint no es válido");
});
