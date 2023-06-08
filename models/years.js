'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class year_place_ngo_officer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	year_place_ngo_officer.init(
		{
			name: DataTypes.INTEGER,
			bn_name: DataTypes.STRING,
			bn_term: DataTypes.STRING,
			type: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'years',
			timestamps: false,
		}
	);

	year_place_ngo_officer.associate = (models) => {};

	return year_place_ngo_officer;
};
