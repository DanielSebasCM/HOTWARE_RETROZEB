const User = require("../models/user.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFYER ------------------

test("first_name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "first_name",
    validationMessages.isMandatory
  );

  try {
    new User({
      first_name: "",
      last_name: "Doe",
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("first_name is not too long", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "first_name",
    validationMessages.mustBeShorterThan(40)
  );

  try {
    new User({
      first_name: "a".repeat(41),
      last_name: "Doe",
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("first name exists", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "first_name",
    validationMessages.isMandatory
  );

  try {
    new User({
      last_name: "Doe",
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("last_name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "last_name",
    validationMessages.isMandatory
  );

  try {
    new User({
      first_name: "a",
      last_name: "",
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("last_name is not too long", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "last_name",
    validationMessages.mustBeShorterThan(40)
  );

  try {
    new User({
      first_name: "a",
      last_name: "a".repeat(41),
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("last name exists", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "last_name",
    validationMessages.isMandatory
  );

  try {
    new User({
      first_name: "a",
      email: "example@example.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("email is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "email",
    validationMessages.isMandatory
  );

  try {
    new User({
      first_name: "a",
      last_name: "asdasd",
      email: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("email is not too long", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "email",
    validationMessages.mustBeShorterThan(40)
  );

  try {
    new User({
      first_name: "a",
      last_name: "asdasd",
      email: "a".repeat(41),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("email exists", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "email",
    validationMessages.isMandatory
  );

  try {
    new User({
      first_name: "a",
      last_name: "asdasd",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("getById return correct user", async () => {
  const user = await User.getById(1);
  expect(user.uid).toEqual(1);
});

test("getAllActive return only active users", async () => {
  const users = await User.getAllActive();
  users.forEach((user) => {
    expect(user.active).toEqual(1);
  });
});

test("post() should insert a new user", async () => {
  const mockUser = new User({
    first_name: "John",
    last_name: "Doe",
    email: "example@example.com",
  });
  const res = await mockUser.post();

  expect(res.insertId).not.toBeNull();
  expect(res.insertId).toBeDefined();

  const createdUser = await User.getById(res.insertId);
  expect(createdUser).toEqual(mockUser);
});

test("delete() should soft delete a user", async () => {
  const mockUser = new User({
    first_name: "John",
    last_name: "Doe",
    email: "example@example.com",
  });
  const res = await mockUser.post();

  const a = await mockUser.delete();

  const createdUser = await User.getById(res.insertId);
  expect(createdUser.active).toEqual(0);
  expect(createdUser).toEqual(mockUser);
});
