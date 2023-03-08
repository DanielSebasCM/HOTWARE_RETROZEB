const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hindsight_questions', {
    id_hindsight: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hindsight',
        key: 'id'
      }
    },
    id_question: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'id'
      }
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'hindsight_questions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_hindsight" },
          { name: "id_question" },
        ]
      },
      {
        name: "id_question",
        using: "BTREE",
        fields: [
          { name: "id_question" },
        ]
      },
    ]
  });
};
