const apiResponse = require('../helpers/apiResponse');
const { Place, Division, District } = require('../models');
exports.getallPlace = async (req, res) => {
    try {
        const place_data = await Place.findAll({
            include: [Division, District]
        });
        if (place_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", place_data)
        } else {
            return apiResponse.ErrorResponse(res, "Place table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getallDivision = async (req, res) => {
    try {
        const division_data = await Division.findAll();
        if (division_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", division_data)
        } else {
            return apiResponse.ErrorResponse(res, "Division table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getDivision = async (req, res) => {
    try {
        const division_data = await Division.findByPk(req.params.id);
        if (division_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", division_data)
        } else {
            return apiResponse.ErrorResponse(res, "Division table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getDistrict = async (req, res) => {
    try {
        const district_data = await District.findByPk(req.params.id);
        if (district_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", district_data)
        } else {
            return apiResponse.ErrorResponse(res, "District table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getallDistrict = async (req, res) => {
    try {
        const district_data = await District.findAll({
            include: [Division]
        });
        if (district_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", district_data)
        } else {
            return apiResponse.ErrorResponse(res, "District table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.createPlace = async (req, res) => {
    try {
        if (req.body.name && req.body.area && req.body.district_id && req.body.division_id) {
            const if_place_exists = await Place.findOne({ where: { name: req.body.name } });
            if (if_place_exists) {
                return apiResponse.ErrorResponse(res, "Place already found in database.")
            } else {
                await Place.create(req.body);
                return apiResponse.successResponse(res, "Data successfully saved.")
            }
        } else {
            return apiResponse.ErrorResponse(res, "name/area/district_id/division_id is missing.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.deleteplacebyid = async (req, res) => {
    try {
        const place_id = req.params.id;
        const place_data = await Place.findOne({ where: { id: place_id } });
        if (place_data) {
            await Place.destroy({ where: { id: place_id } });
            return apiResponse.successResponse(res, "Data successfully deleted.")
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.updatePlace = async (req, res) => {
    try {
        const place_id = req.params.id;
        if (req.body.name && req.body.area && req.body.district_id && req.body.division_id) {
            const if_place_exists = await Place.findOne({ where: { id: place_id } });
            if (if_place_exists) {
                await Place.update(req.body, { where: { id: place_id } });
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, "No matching data found.")
            }
        } else {
            return apiResponse.ErrorResponse(res, "name/area/district_id/division_id is missing.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getDistrictmap = async (req, res) => {
    try {
        const id = req.params.id
        const district_data = await District.findOne({ where: { id: id } });
        if (district_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", district_data)
        } else {
            return apiResponse.ErrorResponse(res, "District table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getDistrictByDivision = async (req, res) => {
    try {
        const id = req.params.id
        const district_data = await District.findAll({ where: { division_id: id } });
        if (district_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", district_data)
        } else {
            return apiResponse.ErrorResponse(res, "District table is empty.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}