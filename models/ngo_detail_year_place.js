'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ngo_detail_year_place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ngo_detail_year_place.init({
    year_id: DataTypes.INTEGER,
    place_id: DataTypes.INTEGER,
    ngo_id: DataTypes.INTEGER,
    ngo_amount: DataTypes.BIGINT,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ngo_detail_year_place',
  });

  ngo_detail_year_place.associate = models => {
    ngo_detail_year_place.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    ngo_detail_year_place.belongsTo(models.Ngo, {
      foreignKey: 'ngo_id',
    });
    ngo_detail_year_place.belongsTo(models.years, {
      foreignKey: 'year_id',
    });
  }

  return ngo_detail_year_place;
};