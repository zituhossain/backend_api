'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class officer_profile_heading extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	officer_profile_heading.init(
		{
			type: DataTypes.TINYINT,
			heading: DataTypes.STRING,
			view_sort: { type: DataTypes.INTEGER, allowNull: true },
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'officer_profile_heading',
		}
	);
	officer_profile_heading.associate = (models) => {
		officer_profile_heading.belongsTo(models.Profile_type, {
			foreignKey: 'type',
		});
	};
	return officer_profile_heading;
};
