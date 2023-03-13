'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Login_attempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Login_attempt.init({
    user_id: DataTypes.INTEGER,
    user_ip: DataTypes.STRING,
    attempt: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'login_attempts',
    modelName: 'Login_attempt',
  });
  return Login_attempt;
};