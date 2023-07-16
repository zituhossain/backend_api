'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class population_year_place extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	population_year_place.init(
		{
			year_id: DataTypes.INTEGER,
			place_id: DataTypes.INTEGER,
			event_type: DataTypes.INTEGER,
			total_population: { type: DataTypes.INTEGER, allowNull: true },
			served_population: { type: DataTypes.INTEGER, allowNull: true },
			male: { type: DataTypes.INTEGER, allowNull: true },
			female: { type: DataTypes.INTEGER, allowNull: true },
			minority: { type: DataTypes.INTEGER, allowNull: true },
			minority1: { type: DataTypes.INTEGER, allowNull: true },
			minority2: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			modelName: 'population_year_place',
		}
	);
	population_year_place.associate = (models) => {
		population_year_place.belongsTo(models.years, {
			foreignKey: 'year_id',
		});
		population_year_place.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
	};
	return population_year_place;
};
