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
    officer_direct_age: DataTypes.INTEGER,
    officer_id: DataTypes.INTEGER,
    event_type: DataTypes.INTEGER,
    popularity: { type: DataTypes.INTEGER, allowNull: true },
    comment: { type: DataTypes.STRING, allowNull: true },
    served_population: { type: DataTypes.INTEGER, allowNull: true },
    percent_served: { type: DataTypes.INTEGER, allowNull: true },
    rank: DataTypes.TINYINT,
    view_order: { type: DataTypes.INTEGER, allowNull: true },
    designation: DataTypes.STRING,
    status: DataTypes.INTEGER,
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
    year_place_ngo_officer.belongsTo(models.ngo_served_percent_by_palces, {
      targetKey: 'ngo_id',
      foreignKey: 'ngo_id',
    });
    year_place_ngo_officer.belongsTo(models.Officer, {
      foreignKey: 'officer_id',
    });
    year_place_ngo_officer.belongsTo(models.years, {
      foreignKey: 'year_id',
    });
  }

  return year_place_ngo_officer;
};