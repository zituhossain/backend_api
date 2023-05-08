'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class NgoCategoryType extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	NgoCategoryType.init(
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

	NgoCategoryType.associate = (models) => {
		NgoCategoryType.belongsTo(models.ngo_categories, {
			as: 'category',
			targetKey: 'id',
			scope: {
	          type: 1
	      	},
			foreignKey: 'ngo_category_id',
		});
		NgoCategoryType.belongsTo(models.ngo_categories, {
			as: 'type',
			targetKey: 'id',
			scope: {
	          type: 0
	      	},
			foreignKey: 'ngo_category_type_id',
		});
		NgoCategoryType.belongsTo(models.Place, {
			as: 'place',
			targetKey: 'id',
			foreignKey: 'place_id',
		});
		// NgoCategoryType.hasOne(models.Place,{
		// 	as: 'place',
		// 	targetKey: 'id',
		// 	foreignKey:'place_id'
		// });
	};

	return NgoCategoryType;
};
