'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Upazilla extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		toJSON() {
			// hide protected fields
			let attributes = Object.assign({}, this.get());
			// for (let a of PROTECTED_ATTRIBUTES) {
			//   delete attributes[a]
			// }
			return attributes;
		}
	}
	Upazilla.init(
		{
			name: DataTypes.STRING,
			place_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'upazillas',
			modelName: 'Upazilla',
		}
	);
	Upazilla.associate = (models) => {
		Upazilla.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
		Upazilla.hasMany(models.Union, {
			foreignKey: 'upazilla_id',
		});
		Upazilla.hasMany(models.Sub_place, {
			foreignKey: 'upazilla_id',
		});
	};
	return Upazilla;
};
