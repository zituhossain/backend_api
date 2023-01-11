'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ngo_details_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ngo_details_info.init({
    title: DataTypes.STRING,
    place_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ngo_details_info',
  });

  ngo_details_info.associate = models => {
    ngo_details_info.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    ngo_details_info.hasMany(models.ngo_details_info_point_wise, {
      foreignKey: 'ngo_details_info_id',
    });
  }

  return ngo_details_info;
};