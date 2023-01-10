'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image_slider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Image_slider.init({
    user_id: DataTypes.INTEGER,
    filename: DataTypes.STRING,
    ordering: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image_slider',
  });
  Image_slider.associate = models =>{
    Image_slider.belongsTo(models.User,{
      foreignKey: 'user_id',
    })
  }
  return Image_slider;
};