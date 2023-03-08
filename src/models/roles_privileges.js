const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles_privileges', {
    id_role: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    id_privilege: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'privilege',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'roles_privileges',
    timestamps: false,
    indexes: [
      {
        name: "id_role",
        using: "BTREE",
        fields: [
          { name: "id_role" },
        ]
      },
      {
        name: "id_privilege",
        using: "BTREE",
        fields: [
          { name: "id_privilege" },
        ]
      },
    ]
  });
};
