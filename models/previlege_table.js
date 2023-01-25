'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Previlege_table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Previlege_table.init({
    user_role_id: DataTypes.INTEGER,
    previlege_url_id: DataTypes.INTEGER,
    permission: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Previlege_table',
  });
  Previlege_table.associate = models => {
    Previlege_table.belongsTo(models.Previlege_url, {
      foreignKey: 'previlege_url_id',
    });
  }
  return Previlege_table;
};