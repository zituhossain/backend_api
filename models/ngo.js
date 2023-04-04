'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Ngo extends Model {
		static associate(models) {
		}
	}
	Ngo.init(
		{
			name: DataTypes.TEXT,
			short_name: DataTypes.TEXT,
			logo_name: DataTypes.TEXT,
			logo: DataTypes.TEXT,
			color_code: DataTypes.STRING,
			view_order: { type: DataTypes.INTEGER, allowNull: true},
			created_by: DataTypes.INTEGER,
			type: DataTypes.ENUM(['regular', 'other']),
			updated_by: DataTypes.INTEGER,
			ngo_jots_id: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			modelName: 'Ngo',
			tableName: 'ngos',
		}
	);

	Ngo.associate = (models) => {
		Ngo.belongsTo(models.Place, {
			foreignKey: 'id',
		});
		Ngo.hasMany(models.ngo_served_percent_by_palces, {
			foreignKey: 'ngo_id',
		});
	};
	return Ngo;
};
