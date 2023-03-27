(async () => {
  const db = require("./src/utils/db");
  const [rows, fields] = await db.execute("SELECT * FROM retrospective", []);
  console.log(rows);
})();
