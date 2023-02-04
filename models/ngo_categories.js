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
    
    name:DataTypes.STRING,
    short_name:DataTypes.STRING,
    color_code:DataTypes.STRING,
    values:DataTypes.STRING,
  }, {
    timestamps:false,
    sequelize,
    modelName: 'ngo_categories',
  });
  return Ngo;
};