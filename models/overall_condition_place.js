'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overall_condition_place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  overall_condition_place.init({
    place_id: DataTypes.INTEGER,
    overall_id: DataTypes.INTEGER,
    createdby: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'overall_condition_place',
  });

  overall_condition_place.associate = models => {
    overall_condition_place.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    overall_condition_place.belongsTo(models.overall_condition, {
      foreignKey: 'overall_id',
    });
  }
 
  return overall_condition_place;
};