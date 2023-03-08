const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teams_labels', {
    id_team: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    id_label: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'label',
        key: 'id'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'teams_labels',
    timestamps: false,
    indexes: [
      {
        name: "id_team",
        using: "BTREE",
        fields: [
          { name: "id_team" },
        ]
      },
      {
        name: "id_label",
        using: "BTREE",
        fields: [
          { name: "id_label" },
        ]
      },
    ]
  });
};
