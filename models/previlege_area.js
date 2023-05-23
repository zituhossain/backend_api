'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Previlege_area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Previlege_area.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    parea_order: { type: DataTypes.INTEGER, allowNull: true},
    previlege_url: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'previlege_areas',
    modelName: 'Previlege_area',
  });

  Previlege_area.associate = (models) => {
    Previlege_area.hasMany(models.Previlege_url, {
      foreignKey: 'previlege_area_id',
    });
  };
  return Previlege_area;
};