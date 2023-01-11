const apiResponse = require('../helpers/apiResponse');
const { ngo_details_info, Place } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


exports.fetchalllocalinfluencer = async (req, res) => {
    const allNgoDetails = await ngo_details_info.findAll({
        include: [Place]
    });
    if (allNgoDetails) {
        return apiResponse.successResponseWithData(res, "ngo_details_info fetch successfully.", allNgoDetails)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.getlocalinfluencerbyid = async (req, res) => {
    try {
        const ngo_details_id = req.params.id;
        const details_data = await ngo_details_info.findOne({ include: [Place], where: { id: ngo_details_id } });
        if (details_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", details_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getlocalinfluencerbyplaceid = async (req, res) => {
    try {
        const influencer_id = req.params.placeid;
        const influencer_data = await ngo_details_info.findAll({ include: [Place], where: { place_id: influencer_id } });
        if (influencer_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", influencer_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.createlocalinfluencer = async (req, res) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.verify(token, secret);
        // const userId = decodedToken._id;
        // req.body.createdby = userId;
        if (Object.keys(req.body).length === 0) {
            return apiResponse.ErrorResponse(res, 'place/title missing')
        } else {
            await ngo_details_info.create(req.body);
            return apiResponse.successResponse(res, 'Ngo Details Info saved successfully.')
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.updatelocalinfluencerbyid = async (req, res) => {
    try {
        const ngo_details_id = req.params.id;
        const details_data = await ngo_details_info.findOne({ where: { id: ngo_details_id } });
        if (details_data) {
            if (req.body.place_id && req.body.title) {
                await ngo_details_info.update(req.body, { where: { id: ngo_details_id } });
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, 'place/title missing')
            }
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}