'use strict';
const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
	class Administration_officer_type extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		toJSON() {
			// hide protected fields
			let attributes = Object.assign({}, this.get());
			for (let a of PROTECTED_ATTRIBUTES) {
				delete attributes[a];
			}
			return attributes;
		}
	}
	Administration_officer_type.init(
		{
			name: DataTypes.STRING,
			view_sort: DataTypes.INTEGER,
			administration_office_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'administration_officer_types',
			modelName: 'Administration_officer_type',
		}
	);
	Administration_officer_type.associate = (models) => {
		Administration_officer_type.belongsTo(models.Administration_office, {
			foreignKey: 'administration_office_id',
		});
	};
	return Administration_officer_type;
};
