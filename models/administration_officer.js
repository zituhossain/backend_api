'use strict';
const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['district_id', 'division_id'];

module.exports = (sequelize, DataTypes) => {
	class Administration_officer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		// toJSON () {
		//   // hide protected fields
		//   let attributes = Object.assign({}, this.get())
		//   for (let a of PROTECTED_ATTRIBUTES) {
		//     delete attributes[a]
		//   }
		//   return attributes
		// }
	}
	Administration_officer.init(
		{
			place_id: DataTypes.INTEGER,
			administration_office_id: DataTypes.INTEGER,
			district_id: DataTypes.INTEGER,
			division_id: DataTypes.INTEGER,
			ngo_id: DataTypes.INTEGER,
			office_id: DataTypes.STRING,
			ordering: DataTypes.INTEGER,
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			phone: DataTypes.STRING,
			address: DataTypes.STRING,
			designation: DataTypes.STRING,
			joining_date: DataTypes.STRING,
			batch: DataTypes.String,
			ability: DataTypes.STRING,
			honesty: DataTypes.STRING,
			qualification: DataTypes.STRING,
			educational_institute: DataTypes.STRING,
			old_work_place: DataTypes.STRING,
			current_work_place: DataTypes.STRING,
			other_info: DataTypes.STRING,
			comments: DataTypes.TEXT,
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER,
			filename: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: 'administration_officers',
			modelName: 'Administration_officer',
		}
	);
	Administration_officer.associate = (models) => {
		Administration_officer.belongsTo(models.Administration_office, {
			foreignKey: 'administration_office_id',
		});
		Administration_officer.belongsTo(models.District, {
			foreignKey: 'district_id',
		});
		Administration_officer.belongsTo(models.Division, {
			foreignKey: 'division_id',
		});
		Administration_officer.belongsTo(models.Place, {
			foreignKey: 'place_id',
		});
		Administration_officer.belongsTo(models.Ngo, {
			targetKey: 'id',
			foreignKey: 'ngo_id',
		});
		Administration_officer.belongsTo(models.Administration_officer_type, {
			targetKey: 'id',
			foreignKey: 'designation',
		});
	};
	return Administration_officer;
};
