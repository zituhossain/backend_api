'use strict';
const {
  Model
} = require('sequelize');
const PROTECTED_ATTRIBUTES = ['division_id', 'district_id']
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON () {
      // hide protected fields
      let attributes = Object.assign({}, this.get())
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a]
      }
      return attributes
    }
  }
  Place.init({
    name: DataTypes.STRING,
    area: DataTypes.TEXT,
    division_id: DataTypes.INTEGER,
    district_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Place',
  });
  Place.associate = models => {
    Place.belongsTo(models.Division, {
      foreignKey: 'division_id',
    });
    Place.belongsTo(models.District, {
      foreignKey: 'district_id',
    });
  }
  return Place;
};