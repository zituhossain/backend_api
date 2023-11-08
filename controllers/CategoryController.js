const apiResponse = require('../helpers/apiResponse');
const { ngo_categories } = require('../models');
const { updatePlaceQueue } = require('../updatePlaceQueue');

exports.create = async (req, res) => {
	try {
		await ngo_categories.create(req.body);
		return apiResponse.successResponse(res, 'data successfully saved.');
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};
// exports.categoryUpdate = async (req, res) => {
// 	const id = req.params.id;
// 	try {
// 		await ngo_categories.update(req.body, {
// 			where: { id },
// 		});
// 		return apiResponse.successResponse(res, 'data successfully updated.');
// 	} catch (e) {
// 		return apiResponse.ErrorResponse(res, 'Value missing.');
// 	}
// };

exports.categoryUpdate = async (req, res) => {
	try {
		const categoryId = req.params.id;
		// Update the category information (e.g., using your existing code)
		await ngo_categories.update(req.body, { where: { id: categoryId } });

		// Trigger the combineDetailsReport function to update all places
		await triggerCombineDetailsReport();

		return apiResponse.successResponse(res, 'Category updated successfully.');
	} catch (error) {
		return apiResponse.ErrorResponse(res, 'Error updating category.');
	}
};

// Import the combineDetailsReport function from your reportController
const { categoryReport } = require('./ReportController');

// Function to trigger combineDetailsReport for all places
async function triggerCombineDetailsReport() {
	try {
		// Call the combineDetailsReport function
		await categoryReport();
	} catch (error) {
		console.error('Error triggering combineDetailsReport:', error);
	}
}

exports.get = async (req, res) => {
	const id = req.params.id;
	try {
		const categoryB = await ngo_categories.findByPk(req.params.id);
		if (categoryB) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				categoryB
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Division table is empty.');
		}
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};

exports.getAll = async (req, res) => {
	try {
		console.log('------------------------------------------');
		const categoryB = await ngo_categories.findAll({
			order: [['view_order', 'ASC']],
		});
		if (categoryB) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				categoryB
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Division table is empty.');
		}
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};

exports.delete = async (req, res) => {
	const id = req.params.id;
	try {
		await ngo_categories.destroy({ where: { id } });
		return apiResponse.successResponse(res, 'Data successfully deleted.');
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};
