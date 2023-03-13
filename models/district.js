'use strict';
const {
  Model
} = require('sequelize');
const PROTECTED_ATTRIBUTES = ['division_id']
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
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
  District.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    place_map: DataTypes.TEXT,
    name_bg: DataTypes.STRING,
    place_count: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'districts',
    modelName: 'District',
  });
  District.associate = models => {
    District.belongsTo(models.Division, {
      foreignKey: 'division_id',
    });
  }
  return District;
};