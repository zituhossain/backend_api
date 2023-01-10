'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Place_comment.init({
    place_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Place_comment',
  });
  Place_comment.associate = models => {
    Place_comment.belongsTo(models.User, {
      foreignKey: 'created_by',
    });
    Place_comment.belongsTo(models.Tag, {
      foreignKey: 'tag_id',
    });
  }
  return Place_comment;
};