const apiResponse = require('../helpers/apiResponse');
const {year_place_ngo_officer} = require('../models');



exports.fetchallTitle = async(req,res) => {
    const allOverallTitle = await year_place_ngo_officer.findAll();
    if(allOverallTitle){
        return apiResponse.successResponseWithData(res,"year_place_ngo_officer fetch successfully.",allOverallTitle)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoveralltitlebyid = async(req,res) => {
    try{
        const title_id = req.params.id;
        const title_data = await year_place_ngo_officer.findOne({where:{id: title_id}});
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
        const title_data = await year_place_ngo_officer.findOne({where:{params: title_id}});
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
            await year_place_ngo_officer.create(req.body);
            return apiResponse.successResponse(res,'titile saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoveralltitlebyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await year_place_ngo_officer.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.title){
                await year_place_ngo_officer.update(req.body, { where: { id: condition_id } });
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