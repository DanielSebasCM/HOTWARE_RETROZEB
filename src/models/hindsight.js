const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hindsight', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','in progress','finished'),
      allowNull: false,
      defaultValue: "pending"
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    id_team: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'team',
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
    tableName: 'hindsight',
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
        name: "id_team",
        using: "BTREE",
        fields: [
          { name: "id_team" },
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
