'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ngo_details_info_point_wise extends Model {
    static associate(models) {
    }
  }
  ngo_details_info_point_wise.init(
  {
    details: DataTypes.STRING,
    place_id: DataTypes.INTEGER,
    createdby: DataTypes.INTEGER,
    ngo_details_info_id: DataTypes.INTEGER,
    view_order: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: 'ngo_details_info_point_wise',
  });

  ngo_details_info_point_wise.associate = models => {
    ngo_details_info_point_wise.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    ngo_details_info_point_wise.belongsTo(models.ngo_details_info, {
      foreignKey: 'ngo_details_info_id',
    });
  }

  return ngo_details_info_point_wise;
};