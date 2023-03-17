const mysql = require("mysql2");
// create the connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotware",
});

module.exports = pool.promise();
