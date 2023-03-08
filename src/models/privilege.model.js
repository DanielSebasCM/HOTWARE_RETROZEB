const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Privilege = sequelize.define(
    "privilege",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      tableName: "privilege",
      timestamps: false,
    }
  );

  return Privilege;
};
