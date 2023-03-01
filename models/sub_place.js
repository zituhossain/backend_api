'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Sub_place extends Model {
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
	Sub_place.init(
		{
			name: DataTypes.STRING,
			area: DataTypes.STRING,
			place_id: DataTypes.INTEGER,
			assigned_officer: DataTypes.STRING,
			officer_phone: DataTypes.STRING,
			population: DataTypes.STRING,
			type: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Sub_place',
		}
	);
	Sub_place.associate = (models) => {
		Sub_place.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
	};
	return Sub_place;
};
