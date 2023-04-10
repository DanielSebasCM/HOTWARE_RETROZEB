const SuggestedTodo = require("../models/suggestedTodo.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const actionableStates = require("../utils/constants").enums.actionableStates;
const { toDoTitleMaxLength, toDoDescriptionMaxLength } =
  require("../utils/constants").limits;
// ------------------ VERIFIER ------------------
test("Todo id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id",
    validationMessages.mustBeInteger
  );
  try {
    new SuggestedTodo({
      id: "a",
      title: "Test",
      description: "Test description",
      id_user_author: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Todo has a title", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      description: "Test description",
      id_user_author: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Todo title is less than ${toDoTitleMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.mustBeShorterThan(toDoTitleMaxLength)
  );
  try {
    new SuggestedTodo({
      title: "a".repeat(toDoTitleMaxLength + 1),
      description: "Test description",
      id_user_author: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test(`Todo description is less than ${toDoDescriptionMaxLength} characters`, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.mustBeShorterThan(toDoDescriptionMaxLength)
  );
  try {
    new SuggestedTodo({
      title: "Test",
      description: "a".repeat(toDoDescriptionMaxLength + 1),
      id_user_author: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Todo state is of type" + actionableStates, () => {
  let thrownError;
  const expectedError = new ValidationError(
    "state",
    validationMessages.mustBeEnum(actionableStates)
  );
  try {
    new SuggestedTodo({
      title: "Test",
      description: "Test description",
      state: "INVALID",
      id_user_author: 1,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Todo has an author", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_user_author",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "Test",
      description: "Test description",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("Todo author id is an integer", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_user_author",
    validationMessages.mustBeInteger
  );
  try {
    new SuggestedTodo({
      title: "Test",
      description: "Test description",
      id_user_author: "a",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

// ------------------ METHODS ------------------
// Get question
test("get SuggestedTodo by id", async () => {
  const createdST = await SuggestedTodo.getById(1);
  // Verify question
  expect(createdST.id).toEqual(1);
  expect(createdST.title).toBeDefined();
  expect(createdST.title.length).toBeGreaterThan(0);
});

test("insert, getById, Accept and Reject SuggestedTodo successfully", async () => {
  const mockSuggestedTodo = new SuggestedTodo({
    title: "Mock SuggestedTodo",
    description: "Mock description",
    state: "PENDING",
    id_user_author: 1,
    id_retrospective: 1,
  });

  // post suggested todo
  const res = await mockSuggestedTodo.post();
  // Verify insert id
  expect(res.insertId).toBeDefined();
  expect(res.insertId).toBeGreaterThan(0);

  // Get suggested todo
  const st = await SuggestedTodo.getById(res.insertId);
  expect(st).toEqual(mockSuggestedTodo);

  // Accept suggested todo
  let acceptedST = await st.accept();
  acceptedST = await SuggestedTodo.getById(res.insertId);
  expect(acceptedST.state).toEqual("ACCEPTED");

  // Reject suggested todo
  let rejectedST = await st.reject();
  rejectedST = await SuggestedTodo.getById(res.insertId);
  expect(rejectedST.state).toEqual("REJECTED");
});
