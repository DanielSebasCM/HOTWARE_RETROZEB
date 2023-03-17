const User = require("../models/user.model");

// ------------------ VERIFYER ------------------

test("first_name is not empty", () => {
  expect(() => {
    new User({
      first_name: "",
      last_name: "Doe",
      email: "example@example.com",
    });
  }).toThrow("El nombre no puede estar vacío");
});

test("first_name is not too long", () => {
  expect(() => {
    new User({
      first_name: "a".repeat(41),
      last_name: "Doe",
      email: "example@example.com",
    });
  }).toThrow("El nombre no puede tener más de 40 caracteres");
});

test("first name exists", () => {
  expect(() => {
    new User({
      last_name: "Doe",
      email: "example@example.com",
    });
  }).toThrow("El nombre no puede estar vacío");
});

test("last_name is not empty", () => {
  expect(() => {
    new User({
      first_name: "John",
      last_name: "",
      email: "example@example.com",
    });
  }).toThrow("El apellido no puede estar vacío");
});

test("last_name is not too long", () => {
  expect(() => {
    new User({
      first_name: "John",
      last_name: "a".repeat(41),
      email: "example@example.com",
    });
  }).toThrow("El apellido no puede tener más de 40 caracteres");
});

test("last name exists", () => {
  expect(() => {
    new User({
      first_name: "John",
      email: "example@example.com",
    });
  }).toThrow("El apellido no puede estar vacío");
});

test("email is not empty", () => {
  expect(() => {
    new User({
      first_name: "John",
      last_name: "Doe",
      email: "",
    });
  }).toThrow("El email no puede estar vacío");
});

test("email is not too long", () => {
  expect(() => {
    new User({
      first_name: "John",
      last_name: "Doe",
      email: "a".repeat(256),
    });
  }).toThrow("El email no puede tener más de 255 caracteres");
});

test("email exists", () => {
  expect(() => {
    new User({
      first_name: "John",
      last_name: "Doe",
    });
  }).toThrow("El email no puede estar vacío");
});

test("getById return correct user", async () => {
  const user = await User.getById(1);
  expect(user.id).toEqual(1);
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

  await mockUser.delete();

  const createdUser = await User.getById(res.insertId);
  expect(createdUser.active).toEqual(0);
  expect(createdUser).toEqual(mockUser);
});
