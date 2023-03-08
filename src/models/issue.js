const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issue', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    epic_name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    story_points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    priority: {
      type: DataTypes.ENUM('Very low','Low','Medium','High','Very High'),
      allowNull: false,
      defaultValue: "Medium"
    },
    id_user_asignee: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    id_sprint: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'sprint',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'issue',
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
        name: "id_user_asignee",
        using: "BTREE",
        fields: [
          { name: "id_user_asignee" },
        ]
      },
      {
        name: "id_sprint",
        using: "BTREE",
        fields: [
          { name: "id_sprint" },
        ]
      },
    ]
  });
};
