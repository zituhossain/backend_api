'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ngo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ngo.init({
    name: DataTypes.TEXT,
    short_name: DataTypes.TEXT,
    logo: DataTypes.TEXT,
    color_code: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    place_id: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ngo',
  });
  return Ngo;
};