const Retrospective = require("../models/retrospective.model");

test("AAAAA", () => {
  let r1 = new Retrospective({
    name: "a".repeat(41),
    id_team: 1,
    id_sprint: 1,
  });
  let r2 = new Retrospective({
    name: "a".repeat(40),
    id_team: 1,
    id_sprint: 1,
  });

  for (let key in r1) {
    expect(r1[key]).toBe(r2[key]);
  }
});
