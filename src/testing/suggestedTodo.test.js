const SuggestedTodo = require("../models/suggestedTodo.model");
const ValidationError = require("../errors/ValidationError");
const validationMessages = require("../utils/messages").validation;
const actionableStates = require("../utils/constants").actionableStates;

// ------------------ VERIFIER ------------------
test("SuggestedTodo title is in range title.length < 40", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.mustBeShorterThan(40)
  );
  try {
    new SuggestedTodo({
      title: "a".repeat(41),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo title.length > 0", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo title is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({});
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo title is not null", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "title",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo description is in range description.length < 255", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.mustBeShorterThan(255)
  );
  try {
    new SuggestedTodo({
      title: "q",
      description: "a".repeat(256),
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo description.length > 0", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
      description: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo description is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("SuggestedTodo description is not null", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "description",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
      description: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_user_author is not null", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_user_author",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
      description: "asdas",
      id_user_author: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_user_author is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_user_author",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
      description: "asdas",
      id_user_author: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_user_author is included", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_user_author",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a",
      description: "asdas",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_retrospective is not empty", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_retrospective",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: "",
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_retrospective is not null", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_retrospective",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: null,
    });
  } catch (error) {
    thrownError = error;
  }
  expect(thrownError).toEqual(expectedError);
});

test("id_retrospective is included", () => {
  let thrownError;
  const expectedError = new ValidationError(
    "id_retrospective",
    validationMessages.isMandatory
  );
  try {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
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
  expect(st.id).toEqual(res.insertId);
  expect(st.title).toEqual(mockSuggestedTodo.title);
  expect(st.description).toEqual(mockSuggestedTodo.description);
  expect(st.id_user_author).toEqual(mockSuggestedTodo.id_user_author);
  expect(st.id_retrospective).toEqual(mockSuggestedTodo.id_retrospective);

  // Accept suggested todo
  let acceptedST = await st.accept();
  acceptedST = await SuggestedTodo.getById(res.insertId);
  expect(acceptedST.state).toEqual("ACCEPTED");

  // Reject suggested todo
  let rejectedST = await st.reject();
  rejectedST = await SuggestedTodo.getById(res.insertId);
  expect(rejectedST.state).toEqual("REJECTED");
});
