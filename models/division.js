'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Division.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    name_bg: DataTypes.STRING,
    district_map:DataTypes.STRING,
    district_count: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'divisions',
    modelName: 'Division',
  });
  return Division;
};