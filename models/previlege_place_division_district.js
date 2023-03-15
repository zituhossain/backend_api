'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Previlege_place_division_district extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Previlege_place_division_district.init({
    place_id: DataTypes.INTEGER,
    user_role_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    district_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'previlege_place_division_districts',
    modelName: 'Previlege_place_division_district',
  });
  Previlege_place_division_district.associate = models =>{
    Previlege_place_division_district.belongsTo(models.District, {
      foreignKey: 'district_id',
    });
    Previlege_place_division_district.belongsTo(models.Division, {
      foreignKey: 'division_id',
    });
    Previlege_place_division_district.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
  }
  return Previlege_place_division_district;
};