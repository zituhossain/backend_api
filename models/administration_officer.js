'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administration_officer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Administration_officer.init({
    place_id: DataTypes.INTEGER,
    administration_office_id: DataTypes.INTEGER,
    ordering: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    designation: DataTypes.STRING,
    joining_date: DataTypes.STRING,
    batch: DataTypes.INTEGER,
    ability: DataTypes.STRING,
    honesty: DataTypes.STRING,
    qualification: DataTypes.STRING,
    comments: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administration_officer',
  });
  return Administration_officer;
};