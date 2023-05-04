'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Tutorial extends Model {
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
			// for (let a of PROTECTED_ATTRIBUTES) {
			//   delete attributes[a]
			// }
			return attributes;
		}
	}
	Tutorial.init(
		{
			name: DataTypes.STRING,
			address: DataTypes.STRING,
			phone: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: 'tutorials',
			modelName: 'Tutorial',
		}
	),
	{
		updateOnDuplicate: ['name', 'address', 'phone'],
	}
	Tutorial.associate = (models) => { };
	return Tutorial;
};
