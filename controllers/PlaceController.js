const { model } = require('mongoose');
const apiResponse = require('../helpers/apiResponse');
const checkUserRoleByPlace = require('./globalController');
const { ngoServedPercentByPlace } = require('../validator/place');

const { Place, Division, District, ngo_category_b, ngo_served_percent_by_palces, year_place_ngo_officer, Ngo, Officer } = require('../models');
const { where } = require('sequelize');
exports.getallPlace = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let roleByplace = await checkUserRoleByPlace(token)
        // console.log(roleByplace)
        let arr = []
        if (roleByplace.district.length > 0) {
            arr.push({ district_id: roleByplace.district })
        } else if (roleByplace.division.length > 0) {
            arr.push({ division_id: roleByplace.division })
        } else if (roleByplace.place.length > 0) {
            arr.push({ id: roleByplace.place })
        }
        // console.log(arr)
        const place_data = await Place.findAll({
            include: [Division, District],
            where: arr,
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
exports.placeConnectWithNgo = async (req, res) => {
    try {
        const data = req.body
        await Place.update({
            ngo_id: data.ngo_id
        }, { where: { id: data.place_id } });
        return apiResponse.successResponse(res, "Data successfully updated.")
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.addCategoryB = async (req, res) => {
    try {
        ngo_category_b.destroy({ where: { place_id: req.body.place_id } });
        if (req.body.place_id && req.body.datas) {
            for (let index = 0; index < req.body.datas.length; index++) {
                const element = req.body.datas[index];
                element.place_id = req.body.place_id;
                await ngo_category_b.create(element);
            }
            return apiResponse.successResponse(res, "Data successfully saved.")

        } else {
            return apiResponse.ErrorResponse(res, "name/place_id/short_name/name/color_code is missing.")
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.placeDetails = async(req, res)=>{
    const d = new Date();
    let year = d.getFullYear();
    const place_id = req.params.id
    try{
        const place_data = await Place.findOne(
            {where:{id: place_id},
            include: [{
                model: ngo_category_b,
                as:"categoryB"
              },
              {
                model:ngo_served_percent_by_palces,
                as:"ngoServedPercentByPalce",
                include:[{
                    model:Ngo,
                    as:"ngo"
                }]

              },
              {
                model:year_place_ngo_officer,
                as:"year_place_ngo_officer",
                where:{
                    year_id:year, 
                    rank:1, 
                },
                required:false,
                include:[Officer, Ngo]
              }
            ],
        
        });
        return apiResponse.successResponseWithData(res,"Data successfully fetched.",place_data)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.placeDetailsAll = async (req, res) => {
    const d = new Date();
    let year = d.getFullYear();
    // const place_id = req.params.id
    try {
        const place_data = await ngo_served_percent_by_palces.findAll({
            include: [
                {
                    model: Place,
                },
                {
                    model: Ngo,
                    as: "ngo"
                },
                {
                    model: Division,
                },
            ],
        }


        );
        return apiResponse.successResponseWithData(res, "Data successfully fetched.", place_data)
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.placeHistory = async(req, res)=>{
    const place_id = req.params.id;
    try {
        const place_data = await year_place_ngo_officer.findAll({
            where:{place_id},
            include:[Ngo],
            order:[['year_id', 'DESC']]
        })
        return apiResponse.successResponseWithData(res,"Data successfully fetched.",place_data)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
    
}
exports.addNgoServedPercent = async(req, res)=>{
    try{
        await ngoServedPercentByPlace.validateAsync({
            ngo_id: req.body.ngo_id,
            district_id: req.body.district_id,
            division_id: req.body.division_id,
            place_id: req.body.place_id,
            percent: req.body.percent,
        })

        await ngo_served_percent_by_palces.destroy({
            where: {
                place_id: req.body.place_id,
                ngo_id: req.body.ngo_id,
            }
        });
        await ngo_served_percent_by_palces.create(req.body);
        return apiResponse.successResponse(res, "Data successfully saved.")
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
