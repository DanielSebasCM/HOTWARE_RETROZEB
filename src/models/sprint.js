const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sprint', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_jira: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_project: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'project',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'sprint',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_project",
        using: "BTREE",
        fields: [
          { name: "id_project" },
        ]
      },
    ]
  });
};
