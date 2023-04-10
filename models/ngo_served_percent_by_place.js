'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NgoServed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NgoServed.init({
    place_id:DataTypes.INTEGER,
    division_id:DataTypes.INTEGER,
    district_id:DataTypes.INTEGER,
    ngo_id:DataTypes.INTEGER,
    percent:DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'ngo_served_percent_by_palces',
    tableName: 'ngo_served_percent_by_palces',
  });
  NgoServed.associate = models => {
    NgoServed.belongsTo(models.Division, {
      foreignKey: 'division_id',
    });
    NgoServed.belongsTo(models.Ngo, {
      as:"ngo",
      targetKey: 'id',
      foreignKey: 'ngo_id',
      });
      NgoServed.belongsTo(models.Place, {
        targetKey: 'id',
        foreignKey: 'place_id',
        });
    
  }
  return NgoServed;
};