'use strict';
const {
  Model
} = require('sequelize');
const PROTECTED_ATTRIBUTES = ['password1', 'password2']
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
  User.init({
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password1: DataTypes.TEXT,
    password2: DataTypes.TEXT,
    office_id: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  User.associate = models =>{
    User.belongsTo(models.User_role,{
      foreignKey: 'role_id',
    })
  }
  return User;
};