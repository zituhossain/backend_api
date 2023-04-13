'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Ngo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Ngo.init(
		{
			ngo_category_id: DataTypes.INTEGER,
			ngo_category_type_id: DataTypes.INTEGER,
			ngo_value: DataTypes.STRING,
			created_by: DataTypes.INTEGER,
			place_id: DataTypes.INTEGER,
			status: DataTypes.STRING,
			updated_by: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'ngo_category_b',
		}
	);

	Ngo.associate = (models) => {
		Ngo.belongsTo(models.ngo_categories, {
			as: 'category',
			targetKey: 'id',
			foreignKey: 'ngo_category_id',
		});
		Ngo.belongsTo(models.ngo_categories, {
			as: 'type',
			targetKey: 'id',
			foreignKey: 'ngo_category_type_id',
		});
	};

	return Ngo;
};
