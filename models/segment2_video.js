'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Segment2_video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Segment2_video.init({
    thumbnail: DataTypes.TEXT,
    title: DataTypes.TEXT,
    link: DataTypes.TEXT,
    ordering: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    visibility: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Segment2_video',
  });
  return Segment2_video;
};