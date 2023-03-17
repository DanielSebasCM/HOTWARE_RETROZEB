const SuggestedTodo = require("../models/suggestedTodo.model");

// ------------------ VERIFIER ------------------
test("SuggestedTodo title is in range title.length < 40", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(41),
    });
  }).toThrow("El tamaño del titulo debe ser menor a 40 caracteres");
});

test("SuggestedTodo title.length > 0", () => {
  expect(() => {
    new SuggestedTodo({
      title: "",
    });
  }).toThrow("Ingresa un titulo");
});

test("SuggestedTodo title is not empty", () => {
  expect(() => {
    new SuggestedTodo({});
  }).toThrow("Ingresa un titulo");
});

test("SuggestedTodo title is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: null,
    });
  }).toThrow("Ingresa un titulo");
});

test("SuggestedTodo description is in range description.length < 255", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: "a".repeat(256),
    });
  }).toThrow("La descripcion debe ser menor a 255 caracteres");
});

test("SuggestedTodo description.length > 0", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: "",
    });
  }).toThrow("Ingresa una descripcion");
});

test("SuggestedTodo description is not empty", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
    });
  }).toThrow("Ingresa una descripcion");
});

test("SuggestedTodo description is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "hola",
      description: null,
    });
  }).toThrow("Ingresa una descripcion");
});

test("id_user_author is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
      id_user_author: null,
    });
  }).toThrow("id_user_author no debe ser nulo");
});

test("id_user_author is not empty", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
      id_user_author: "",
    });
  }).toThrow("id_user_author no debe ser nulo");
});

test("id_user_author is included", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
    });
  }).toThrow("id_user_author no debe ser nulo");
});

test("id_user_author is number", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "PENDING",
      description: "...",
      id_user_author: "Esto no sirve",
    });
  }).toThrow("id_user_author debe ser un número entero");
});

test("id_retrospective is not empty", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: "",
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

test("id_retrospective is not null", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: null,
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

test("id_retrospective is included", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
    });
  }).toThrow("id_retrospective no debe ser nulo");
});

test("id_retrospective is number", () => {
  expect(() => {
    new SuggestedTodo({
      title: "a".repeat(40),
      state: "ACCEPTED",
      description: "...",
      id_user_author: 4,
      id_retrospective: "Esto no sirve",
    });
  }).toThrow("id_retrospective debe ser un número entero");
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
