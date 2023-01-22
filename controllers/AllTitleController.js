const apiResponse = require('../helpers/apiResponse');
const {all_title} = require('../models');



exports.fetchallTitle = async(req,res) => {
    const allOverallTitle = await all_title.findAll();
    if(allOverallTitle){
        return apiResponse.successResponseWithData(res,"all_title fetch successfully.",allOverallTitle)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoveralltitlebyid = async(req,res) => {
    try{
        const title_id = req.params.id;
        const title_data = await all_title.findOne({where:{id: title_id}});
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
        const title_data = await all_title.findOne({where:{params: title_id}});
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
            await all_title.create(req.body);
            return apiResponse.successResponse(res,'titile saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoveralltitlebyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await all_title.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.title){
                await all_title.update(req.body, { where: { id: condition_id } });
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