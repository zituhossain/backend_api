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
			// for (let "a" of PROTECTED_ATTRIBUTES) {
			//   delete attributes[a]
			// }
			return attributes;
		}
	}
	Sub_place.init(
		{
			name: { type: DataTypes.STRING, allowNull: false, unique: true},
			comments: { type: DataTypes.STRING, allowNull: true},
			place_id: { type: DataTypes.INTEGER, allowNull: false},
			assigned_officer: { type: DataTypes.STRING, allowNull: true},
			officer_phone: { type: DataTypes.STRING, allowNull: true},
			population: { type: DataTypes.INTEGER, allowNull: true },
			type: { type: DataTypes.INTEGER, allowNull: true},
		},
		{
			sequelize,
			tableName: 'sub_places',
			modelName: 'Sub_place',
		}
	);
	Sub_place.associate = (models) => {
		Sub_place.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
		Sub_place.belongsTo(models.Upazilla, {
			foreignKey: 'upazilla_id',
		});
		Sub_place.belongsTo(models.Union, {
			foreignKey: 'union_id',
		});
	};
	return Sub_place;
};
