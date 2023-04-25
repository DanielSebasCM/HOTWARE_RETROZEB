const Privilege = require("../models/privilege.model");
const ValidationError = require("../errors/validationError");
const validationMessages = require("../utils/messages").validation;
const privilegeMaxLength =
  require("../utils/constants").limits.privilegeMaxLength;

test("Privilege id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new Privilege({
      id: "a",
      name: "test",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Privilege has name", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Privilege({});
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Privilege name is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.isMandatory
  );
  try {
    new Privilege({
      name: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Privilege name is not longer than ${privilegeMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "name",
    validationMessages.mustBeShorterThan(privilegeMaxLength)
  );
  try {
    new Privilege({
      name: "a".repeat(privilegeMaxLength + 1),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("privilege get by id", async () => {
  const privilege = await Privilege.getById(1);
  expect(privilege.id).toBe(1);
});
