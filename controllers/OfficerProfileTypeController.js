const apiResponse = require('../helpers/apiResponse');
const { Profile_type } = require('../models');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");


exports.fetchallTitle = async (req, res) => {
    const allOverallTitle = await Profile_type.findAll();
    if (allOverallTitle) {
        return apiResponse.successResponseWithData(res, "officer_profile_type fetch successfully.", allOverallTitle)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.getoveralltitlebyid = async (req, res) => {
    try {
        const title_id = req.params.id;
        const title_data = await Profile_type.findOne({ where: { id: title_id } });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getoveralltitlebyparams = async (req, res) => {
    try {
        const title_id = req.params.params;
        const title_data = await Profile_type.findOne({ where: { params: title_id } });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.createOfficerProfileType = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken._id;
        req.body.created_by = userId;
        console.log("req.body", req.body)
        if (Object.keys(req.body).length === 0) {
            return apiResponse.ErrorResponse(res, 'description missing')
        } else {
            await Profile_type.create(req.body);
            return apiResponse.successResponse(res, 'OfficerProfileType saved successfully.')
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.updateoveralltitlebyid = async (req, res) => {
    try {
        const condition_id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken._id;
        req.body.updated_by = userId;
        const condition_data = await Profile_type.findOne({ where: { id: condition_id } });
        if (condition_data) {
            if (req.body.type) {
                await Profile_type.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, 'type missing')
            }
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}