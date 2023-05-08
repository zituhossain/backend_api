'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class NgoCategories extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	NgoCategories.init(
		{
			name: DataTypes.STRING,
			short_name: DataTypes.STRING,
			color_code: DataTypes.STRING,
			values: DataTypes.STRING,
			type: DataTypes.TINYINT,
			view_order: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			timestamps: false,
			sequelize,
			modelName: 'ngo_categories',
		}
	);
	NgoCategories.associate = (models) => {
		NgoCategories.hasMany(models.ngo_category_b, {
			foreignKey: 'ngo_category_id',
		});
		NgoCategories.hasMany(models.ngo_category_b, {
			foreignKey: 'ngo_category_type_id',
		});
	};
	return NgoCategories;
};
