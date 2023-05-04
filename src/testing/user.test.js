const User = require("../models/user.model");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;

// ------------------ VERIFYER ------------------

test("User uid is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "uid",
    validationMessages.mustBeInteger
  );
  try {
    new User({
      uid: "Not an integer",
      id_google_auth: "abcd",
      first_name: "John",
      last_name: "Doe",
      email: "test@test.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("User has id_google_auth", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_google_auth",
    validationMessages.isMandatory
  );
  try {
    new User({
      id_jira: "absd",
      first_name: "John",
      last_name: "Doe",
      email: "test@test.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("User has first_name", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "first_name",
    validationMessages.isMandatory
  );
  try {
    new User({
      id_jira: "absd",
      id_google_auth: "abcd",
      last_name: "Doe",
      email: "test@test.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("User has last_name", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "last_name",
    validationMessages.isMandatory
  );
  try {
    new User({
      id_jira: "absd",
      id_google_auth: "abcd",
      first_name: "John",
      email: "test*test.com",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("User has email", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "email",
    validationMessages.isMandatory
  );
  try {
    new User({
      id_jira: "absd",
      id_google_auth: "abcd",
      first_name: "John",
      last_name: "Doe",
      active: 1,
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
    id_google_auth: "abcd",
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
    id_google_auth: "abcd",
  });
  const res = await mockUser.post();

  const a = await mockUser.delete();

  const createdUser = await User.getById(res.insertId);
  expect(createdUser.active).toEqual(0);
  expect(createdUser).toEqual(mockUser);
});
