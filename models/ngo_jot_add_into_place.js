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
			place_id: DataTypes.INTEGER,
			division_id: DataTypes.INTEGER,
			district_id: DataTypes.INTEGER,
			ngo_jot_id: DataTypes.INTEGER,
			percent: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'ngo_jot_add_into_places',
			tableName: 'ngo_jot_add_into_places',
		}
	);

	Ngo.associate = (models) => {
		Ngo.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
		Ngo.belongsTo(models.ngo_jots, {
			targetKey: 'id',
			foreignKey: 'ngo_jot_id',
		});
		Ngo.belongsTo(models.Division, {
			foreignKey: 'division_id',
		});
		Ngo.belongsTo(models.District, {
			foreignKey: 'district_id',
		});
	};
	return Ngo;
};
