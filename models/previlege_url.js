'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Previlege_url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Previlege_url.init({
    name: DataTypes.TEXT,
    previlege_area_id: DataTypes.INTEGER,
    url: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'previlege_urls',
    modelName: 'Previlege_url',
  });
  Previlege_url.associate = models => {
    Previlege_url.belongsTo(models.Previlege_area, {
      foreignKey: 'previlege_area_id',
    });
  }
  return Previlege_url;
};