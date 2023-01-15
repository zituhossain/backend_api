'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class year_place_ngo_officer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  year_place_ngo_officer.init({
    year_id: DataTypes.INTEGER,
    place_id: DataTypes.INTEGER,
    ngo_id: DataTypes.INTEGER,
    officer_id: DataTypes.INTEGER,
    served_population: DataTypes.BIGINT,
    percent_served: DataTypes.INTEGER,
    rank: DataTypes.TINYINT,
    field: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'year_place_ngo_officer',
  });

  year_place_ngo_officer.associate = models => {
    year_place_ngo_officer.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    year_place_ngo_officer.belongsTo(models.Ngo, {
      foreignKey: 'ngo_id',
    });
    year_place_ngo_officer.belongsTo(models.Officer, {
      foreignKey: 'officer_id',
    });
  }

  return year_place_ngo_officer;
};