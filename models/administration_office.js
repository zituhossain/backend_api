'use strict';
const {
  Model
} = require('sequelize');
const administration_officer = require('./administration_officer');
const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt']

module.exports = (sequelize, DataTypes) => {
  class Administration_office extends Model {
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
  Administration_office.init({
    name: DataTypes.STRING,
    ordering: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administration_office',
  });
  Administration_office.associate = models => {
    Administration_office.hasMany(models.Administration_officer, {
      foreignKey: 'administration_office_id',
    });
  }
  return Administration_office;
};