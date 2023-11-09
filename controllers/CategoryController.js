const apiResponse = require('../helpers/apiResponse');
const { ngo_categories } = require('../models');
const { updatePlaceQueue } = require('../updatePlaceQueue');
const { updateAllPlacesWithCategoryData } = require('./ReportController');

exports.createCategory = async (req, res) => {
	try {
		await ngo_categories.create(req.body);
		// After successfully creating the category data, trigger the function to update all places
		await updateAllPlacesWithCategoryData();
		return apiResponse.successResponse(res, 'data successfully saved.');
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};

exports.updateCategory = async (req, res) => {
	const id = req.params.id;

	try {
		await ngo_categories.update(req.body, {
			where: { id },
		});
		// After successfully updating the category data, trigger the function to update all places
		updateAllPlacesWithCategoryData();

		// Respond immediately without waiting for the background update to complete
		return apiResponse.successResponse(
			res,
			'Data update triggered successfully.'
		);
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};

exports.getCategoryById = async (req, res) => {
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

exports.getAllCategory = async (req, res) => {
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

exports.deleteCategory = async (req, res) => {
	const id = req.params.id;
	try {
		await ngo_categories.destroy({ where: { id } });
		// After successfully deleting the category data, trigger the function to update all places
		await updateAllPlacesWithCategoryData();
		return apiResponse.successResponse(res, 'Data successfully deleted.');
	} catch (e) {
		return apiResponse.ErrorResponse(res, 'Value missing.');
	}
};
