const apiResponse = require('../helpers/apiResponse');
const {Tag  , overall_condition_place , Place} = require('../models');



exports.fetchallovealllcondition = async(req,res) => {
    const allOverallCondition = await Tag.findAll();
    if(allOverallCondition){
        return apiResponse.successResponseWithData(res,"tag fetch successfully.",allOverallCondition)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({where:{id: condition_id}});
        if(condition_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",condition_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.createoverallcondition = async(req,res) => {
    try{
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'description missing')
        }else{
            await overall_condition.create(req.body);
            return apiResponse.successResponse(res,'condition saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getoverallconditionbyplacexid = async(req,res) => {
    try{
        const condition_id = req.params.placeid;
        // const condition_data = await overall_condition.findAll({include:[ overall_condition_place]});
        const condition_data = await overall_condition.findAll({include:[ {
            model: overall_condition_place,
            where: {place_id: condition_id} , required: false
        }]});

        if(condition_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",condition_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.description){
                await overall_condition.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res,"Data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,'description missing')
            }
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}