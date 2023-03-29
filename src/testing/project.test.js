const Project = require("../models/project.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

//name is in range
test("name length is in range", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new Project({ name: "a".repeat(41) });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

//name is not empty
test("name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Project({ name: "" });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

//name is not null
//no sea nulo, no este vacio, no este undefined

test("name exists", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Project({});
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
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
