const apiResponse = require('../helpers/apiResponse');
const {
	ngo_details_info_point_wise,
	Place,
	ngo_details_info,
} = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const checkUserRoleByPlace = require('./globalController');
const { Op } = require('sequelize');

exports.fetchalllocalinfluencer = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	let roleByplace = await checkUserRoleByPlace(token);
	let arr = [];
	if (roleByplace.place.length > 0) {
		arr.push({ place_id: roleByplace.place });
	}
	const allNgoDetails = await ngo_details_info_point_wise.findAll({
		include: [Place, ngo_details_info],
		where: arr,
	});
	if (allNgoDetails) {
		return apiResponse.successResponseWithData(
			res,
			'ngo_details_info_point_wise fetch successfully.',
			allNgoDetails
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.getlocalinfluencerbyid = async (req, res) => {
	try {
		const ngo_details_id = req.params.id;
		const details_data = await ngo_details_info_point_wise.findOne({
			include: [Place, ngo_details_info],
			where: { id: ngo_details_id },
		});
		if (details_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				details_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getNgoDetailPointWisebyplaceid = async (req, res) => {
    try {
        const placeid = req.params.placeid;
        const influencer_data = await ngo_details_info_point_wise.findAll({
            include: [
                Place, ngo_details_info
            ],
            where: { place_id: placeid }
         });
        if (influencer_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", influencer_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

// exports.getNgoDetailPointWisebyplaceid = async (req, res) => {
// 	try {
// 		const placeid = req.params.placeid;
// 		const titleId = req.params.titleId; // Updated parameter name

// 		const influencer_data = await ngo_details_info_point_wise.findAll({
// 			include: [
// 				{ model: Place },
// 				{
// 					model: ngo_details_info,
// 					attributes: ['id'], // Retrieve only the 'id' attribute (title_id)
// 					where: { id: titleId }, // Updated to filter by ngo_details_info_id
// 				},
// 			],
// 			where: {
// 				place_id: placeid,
// 				details: { [Op.not]: null },
// 			},
// 		});

// 		if (influencer_data) {
// 			return apiResponse.successResponseWithData(
// 				res,
// 				'Data successfully fetched.',
// 				influencer_data
// 			);
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No matching query found');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.createNgoDetailPointWise = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.createdby = userId;
		if (Object.keys(req.body).length === 0) {
			return apiResponse.ErrorResponse(res, 'place/title missing');
		} else {
			await ngo_details_info_point_wise.create(req.body);
			return apiResponse.successResponse(
				res,
				'Ngo Details Info saved successfully.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.createNgoDetailPointWise = async (req, res) => {
// 	try {
// 		const token = req.headers.authorization.split(' ')[1];
// 		const decodedToken = jwt.verify(token, secret);
// 		const userId = decodedToken._id;
// 		req.body.createdby = userId;

// 		if (Object.keys(req.body).length === 0) {
// 			return apiResponse.ErrorResponse(res, 'place/title missing');
// 		}

// 		const { place_id, ngo_details_info_id } = req.body;
// 		const existingRecord = await ngo_details_info_point_wise.findOne({
// 			where: { place_id, ngo_details_info_id },
// 		});

// 		if (existingRecord) {
// 			// Update the existing record
// 			await ngo_details_info_point_wise.update(req.body, {
// 				where: { place_id, ngo_details_info_id },
// 			});
// 			return apiResponse.successResponse(res, 'Ngo Details Info updated successfully.');
// 		} else {
// 			// Create a new record
// 			await ngo_details_info_point_wise.create(req.body);
// 			return apiResponse.successResponse(res, 'Ngo Details Info saved successfully.');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.updatelocalinfluencerbyid = async (req, res) => {
	try {
		const ngo_details_id = req.params.id;
		const details_data = await ngo_details_info_point_wise.findOne({
			where: { id: ngo_details_id },
		});
		if (details_data) {
			if (req.body.place_id && req.body.details) {
				await ngo_details_info_point_wise.update(req.body, {
					where: { id: ngo_details_id },
				});
				return apiResponse.successResponse(res, 'Data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'place/details missing');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteNgoDetailPointWiseById = async (req, res) => {
	const ngo_details_info_point_wises_id = req.params.id;
	try {
		const ngo_details_info_point_wises_data =
			await ngo_details_info_point_wise.findAll({
				where: { id: ngo_details_info_point_wises_id },
			});
		if (ngo_details_info_point_wises_data.length > 0) {
			await ngo_details_info_point_wise.destroy({
				where: { id: ngo_details_info_point_wises_id },
			});
			return apiResponse.successResponse(res, 'Data deleted successfully.');
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
