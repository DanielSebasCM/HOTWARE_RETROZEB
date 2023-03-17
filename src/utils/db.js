const mysql = require("mysql2");
// create the connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "hotware",
});

module.exports = pool.promise();
