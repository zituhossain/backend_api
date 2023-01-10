'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overall_condition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  overall_condition.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'overall_condition',
  });
  return overall_condition;
};