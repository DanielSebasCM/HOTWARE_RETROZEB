const isValidDate = require("../utils/isValidDate");

test("isValidDate", () => {
  expect(isValidDate("2020-01-01 00:00:00")).toBe(true);
  expect(isValidDate("2020-13-01 00:00:00")).toBe(false);
  expect(isValidDate("2020-01-32 00:00:00")).toBe(false);
  expect(isValidDate("2020-01-01 24:00:01")).toBe(false);
  expect(isValidDate("2020-01-01 00:60:00")).toBe(false);
  expect(isValidDate("2020-01-01 00:00:60")).toBe(false);
  expect(isValidDate("2020-01-01")).toBe(false);
  expect(isValidDate("2020-01-01 00:00:00:00")).toBe(false);
  expect(isValidDate("2020-01 00:00:00")).toBe(false);
  expect(isValidDate("2020-01-01 00-00-00")).toBe(false);
});
