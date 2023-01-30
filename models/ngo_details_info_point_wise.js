'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ngo_details_info_point_wise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ngo_details_info_point_wise.init({
    details: DataTypes.STRING,
    place_id: DataTypes.INTEGER,
    createdby: DataTypes.INTEGER,
    ngo_details_info_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ngo_details_info_point_wise',
  });

  ngo_details_info_point_wise.associate = models => {
    ngo_details_info_point_wise.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    // ngo_details_info_point_wise.belongsTo(models.ngo_details_info, {
    //   foreignKey: 'ngo_details_info_id',
    // });
  }

  return ngo_details_info_point_wise;
};