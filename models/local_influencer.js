'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class local_influencer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  local_influencer.init({
    place_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    name: DataTypes.STRING,
    designation: DataTypes.STRING,
    createdby: DataTypes.INTEGER,
    organization: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'local_influencer',
  });
  local_influencer.associate = models => {
    local_influencer.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
  }
  return local_influencer;
};