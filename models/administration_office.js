'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administration_office extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Administration_office.init({
    name: DataTypes.STRING,
    ordering: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administration_office',
  });
  return Administration_office;
};