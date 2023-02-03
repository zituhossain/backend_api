const apiResponse = require('../helpers/apiResponse');
const { overall_condition, overall_condition_place, Place , sequelize } = require('../models');



exports.fetchallovealllcondition = async (req, res) => {
    const allOverallCondition = await overall_condition.findAll();
    if (allOverallCondition) {
        return apiResponse.successResponseWithData(res, "overall_condition fetch successfully.", allOverallCondition)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.getoverallconditionbyid = async (req, res) => {
    try {
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({ where: { id: condition_id } });
        if (condition_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", condition_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.createoverallcondition = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return apiResponse.ErrorResponse(res, 'description missing')
        } else {
            await overall_condition.create(req.body);
            return apiResponse.successResponse(res, 'condition saved successfully.')
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getoverallconditionbyplacexid = async (req, res) => {
    try {
        const placeid = req.params.placeid;
        // console.log("placeid Ashikkkkkkkkkkkk",placeid)
        // const condition_data = await overall_condition.findAll({include:[ overall_condition_place]});
        // const condition_data = await overall_condition.findAll({include:[ {
        //     model: overall_condition_place,
        //     where: {place_id: placeid} , required: false
        // }]});
         const [results, metadata]  = await sequelize.query(`SELECT overall_condition_places.* , overall_conditions.*
            FROM overall_conditions
            LEFT JOIN overall_condition_places
            ON overall_conditions.id = overall_condition_places.overall_id and overall_condition_places.place_id = ${placeid}`)
        // console.log("results",results)
        // console.log("metadata",metadata)


        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getoverallconditionbydivisiondistrictxid = async (req, res) => {
    try {
        const id = req.params.id;
        const condition_name = req.params.condition;
        let place_id = [];
        if(condition_name === "district"){
            const get_place_by_district = await Place.findAll({
                where:{
                    district_id: id
                }
            })
    
            for(i=0;i<get_place_by_district.length;i++){
                place_id.push(get_place_by_district[i].id)
            }

        }else if(condition_name === "division"){
            const get_place_by_division = await Place.findAll({
                where:{
                    division_id: id
                }
            })
    
            for(i=0;i<get_place_by_division.length;i++){
                place_id.push(get_place_by_division[i].id)
            }
        }
        let query = "("+place_id.toString()+")";
        const [results, metadata]  = await sequelize.query(`SELECT overall_condition_places.* , overall_conditions.*
            FROM overall_conditions
            LEFT JOIN overall_condition_places
            ON overall_conditions.id = overall_condition_places.overall_id and overall_condition_places.place_id in ${query}`)

        console.log(`aaaaaaaaa SELECT overall_condition_places.* , overall_conditions.*
        FROM overall_conditions
        LEFT JOIN overall_condition_places
        ON overall_conditions.id = overall_condition_places.overall_id and overall_condition_places.place_id in ${query}`)

        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.updateoverallconditionbyid = async (req, res) => {
    try {
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({ where: { id: condition_id } });
        if (condition_data) {
            if (req.body.description) {
                await overall_condition.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, 'description missing')
            }
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}