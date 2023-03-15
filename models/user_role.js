'use strict';
const {
  Model
} = require('sequelize');
const {Previlege_area} = require('./previlege_area');
module.exports = (sequelize, DataTypes) => {
  class User_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_role.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    previlege_id: DataTypes.INTEGER,
    permission: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'user_roles',
    modelName: 'User_role',
  });

  User_role.associate = models => {
    User_role.belongsTo(models.Previlege_area, {
      foreignKey: 'previlege_id',
    });
  }
  
  return User_role;
};
