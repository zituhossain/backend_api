'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Officer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Officer.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: DataTypes.STRING,
			father_name: DataTypes.STRING,
			address: DataTypes.STRING,
			phone: DataTypes.STRING,
			email: DataTypes.STRING,
			nid: DataTypes.STRING,
			educational_qualification: DataTypes.STRING,
			financial_activities: DataTypes.STRING,
			gender: DataTypes.STRING,
			status: DataTypes.STRING,
			division_id: DataTypes.INTEGER,
			district_id: DataTypes.INTEGER,
			place_id: DataTypes.INTEGER,
			ngo_id: DataTypes.INTEGER,
			image: DataTypes.TEXT,
		},
		{
			sequelize,
			modelName: 'Officer',
		}
	);
	Officer.associate = (models) => {
		Officer.belongsTo(models.Ngo, {
			foreignKey: 'ngo_id',
		});
	};
	return Officer;
};
