const Sequelize = require("sequelize");

const sequelize = new Sequelize("hotware", "root", "hotware", {
  host: "127.0.0.1",
  dialect: "mariadb",
  port: "3307",
});

const Privilege = require("./privilege.model.js")(sequelize);

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

run();
