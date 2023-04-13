'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Union extends Model {
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
	Union.init(
		{
			name: DataTypes.STRING,
			upazilla_id: DataTypes.INTEGER,
			comment: DataTypes.STRING,
			population: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			tableName: 'unions',
			modelName: 'Union',
		}
	);
	Union.associate = (models) => {
		Union.belongsTo(models.Upazilla, {
			foreignKey: 'upazilla_id',
		});
		Union.hasMany(models.Sub_place, {
			foreignKey: 'union_id',
		});
	};
	return Union;
};
