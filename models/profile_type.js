'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Profile_type extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Profile_type.init(
		{
			type: DataTypes.STRING,
			sort: { type: DataTypes.INTEGER, allowNull: true },
			created_by: DataTypes.NUMBER,
		},
		{
			sequelize,
			tableName: 'profile_types',
			modelName: 'Profile_type',
		}
	);
	Profile_type.associate = (models) => {
		Profile_type.hasMany(models.officer_profile_heading, {
			foreignKey: 'type',
		});
	};
	return Profile_type;
};
