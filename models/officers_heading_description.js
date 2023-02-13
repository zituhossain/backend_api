'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class officers_heading_description extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  officers_heading_description.init({
    year_id: DataTypes.INTEGER,
    officer_id: DataTypes.INTEGER,
    heading_id: DataTypes.INTEGER,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'officers_heading_description',
  });
  return officers_heading_description;
};