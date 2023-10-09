const apiResponse = require('../helpers/apiResponse');

const {
	Division,
	District,
	sequelize,
} = require('../models');
const { where } = require('sequelize');
var Sequelize = require('sequelize');

exports.fetchDivisions = async (req, res) => {
	console.log('here');
	try {

		let division_data;
		
			division_data = await Division.findAll(); // Fetch all divisions if no division IDs are set in the user's role

		if (division_data && division_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'division Data successfully fetched.',
				division_data
			);
		}
		else {
			return apiResponse.ErrorResponse(res, 'No divisions found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};


exports.fetchDistricts = (req, res) => {
  setTimeout(async () => {
    try {
      let district_data = await District.findAll();

      if (district_data && district_data.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          'District Data successfully fetched.',
          district_data
        );
      } else {
        return apiResponse.ErrorResponse(res, 'No districts found.');
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err.message);
    }
  }, 10000); // Delay of 10 seconds
};
