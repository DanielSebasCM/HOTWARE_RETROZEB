const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issues_labels', {
    id_issue: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'issue',
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
    }
  }, {
    sequelize,
    tableName: 'issues_labels',
    timestamps: false,
    indexes: [
      {
        name: "id_issue",
        using: "BTREE",
        fields: [
          { name: "id_issue" },
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
