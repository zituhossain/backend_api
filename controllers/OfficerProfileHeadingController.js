const apiResponse = require('../helpers/apiResponse');
const {officer_profile_heading} = require('../models');



exports.fetchallTitle = async(req,res) => {
    const allOverallTitle = await officer_profile_heading.findAll();
    if(allOverallTitle){
        return apiResponse.successResponseWithData(res,"officer_profile_heading fetch successfully.",allOverallTitle)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoveralltitlebyid = async(req,res) => {
    try{
        const title_id = req.params.id;
        const title_data = await officer_profile_heading.findOne({where:{id: title_id}});
        if(title_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",title_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getoveralltitlebyparams = async(req,res) => {
    try{
        const title_id = req.params.params;
        const title_data = await officer_profile_heading.findOne({where:{params: title_id}});
        if(title_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",title_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.createoveralltitle = async(req,res) => {
    try{
        console.log("req.body",req.body)
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'description missing')
        }else{
            await officer_profile_heading.create(req.body);
            return apiResponse.successResponse(res,'titile saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoveralltitlebyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await officer_profile_heading.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.title){
                await officer_profile_heading.update(req.body, { where: { id: condition_id } });
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