const Project = require("../models/project.model");

//name is in range
test("name length is in range", () => {
  expect(() => {
    new Project({
      name: "a".repeat(41),
    });
  }).toThrow("El nombre debe ser menor a 40 caracteres");
});

//name is not empty
test("name is not empty", () => {
  expect(() => {
    new Project({
      name: "",
      id_jira: "123",
      active: 1,
    });
  }).toThrow("El nombre no puede estar vacío");
});

//name is not null
//no sea nulo, no este vacio, no este undefined

test("name exists", () => {
  expect(() => {
    new Project({
      id_jira: "123",
      active: 1,
    });
  }).toThrow("El nombre no puede ser nulo");
});

test("project getbyId", async () => {
  const mockProject = await Project.getById(1);
  expect(mockProject.id).toEqual(1);
});

//test get all projects

test("Project getAll", async () => {
  await expect(async () => {
    await Project.getAll();
  }).not.toThrow();
});

//test mock project

test("project inserted successfully", async () => {
  // Mock project
  const mockProject = new Project({
    name: "Proyecto 1",
    id_jira: "",
    active: 1,
  });

  // Insert project
  const res = await mockProject.post();
  // Verify id created
  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  // Get project
  const createdProject = await Project.getById(res.insertId);
  // Verify project
  expect(mockProject).toEqual(createdProject);
});

// test delete project and change active to 0

test("project deleted successfully", async () => {
  // Mock project
  const mockProject = new Project({
    name: "Proyecto 1",
    id_jira: "",
    active: 1,
  });

  // Insert project
  const res = await mockProject.post();

  await mockProject.delete();

  const deletedProject = await Project.getById(res.insertId);

  // Verify project

  expect(deletedProject.active).toEqual(0);
  expect(mockProject).toEqual(deletedProject);
});
