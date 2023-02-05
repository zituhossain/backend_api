'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile_type.init({
    type: DataTypes.STRING,
    sort: DataTypes.NUMBER,
    created_by: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Profile_type',
  });
  return Profile_type;
};