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
    type:DataTypes.ENUM(['regular','other']),
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ngo',
  });

  
  Ngo.associate = models => {
    Ngo.belongsTo(models.Place, {
      foreignKey: 'id',
    });
  }
  return Ngo;
};