const initModels = require("./init-models");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("hotware", "root", "hotware", {
  host: "localhost",
  dialect: "mariadb",
  port: "3306",
});

module.exports = initModels(sequelize);
