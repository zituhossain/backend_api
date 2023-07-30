'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Setting extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		// toJSON() {
		// 	// hide protected fields
		// 	let attributes = Object.assign({}, this.get());
		// 	// for (let a of PROTECTED_ATTRIBUTES) {
		// 	//   delete attributes[a]
		// 	// }
		// 	return attributes;
		// }
	}
	Setting.init(
		{
			name: DataTypes.STRING,
			value: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'settings',
			modelName: 'Setting',
		}
	);	
	return Setting;
};
