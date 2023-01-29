const apiResponse = require('../helpers/apiResponse');
const {year_place_ngo_officer , Officer , Ngo} = require('../models');
const checkUserRoleByPlace = require('./globalController');


exports.fetchYearPlaceNgoofficer = async(req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    let roleByplace = await checkUserRoleByPlace(token)
    let arr = [];
    if(roleByplace.place.length > 0){
        arr.push({place_id: roleByplace.place})
    }
    const allOverallTitle = await year_place_ngo_officer.findAll({
        where: arr
    });
    if(allOverallTitle){
        return apiResponse.successResponseWithData(res,"year_place_ngo_officer fetch successfully.",allOverallTitle)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getYearPlaceNgoofficerbyid = async(req,res) => {
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

exports.getYearPlaceNgoOfficebyPlace = async(req,res) => {
    try{
        const placeid = req.params.placeid;
        const title_data = await year_place_ngo_officer.findOne({where:{place_id: placeid}});
        if(title_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",title_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getYearPlaceNgoOfficebyYear = async(req,res) => {
    try{
        const placeid = req.params.year;
        const id = req.params.id;
        console.log("id",id)
        const title_data = await year_place_ngo_officer.findOne({include:[Officer,Ngo] ,where:{year_id: placeid , ngo_id:id}});
        if(title_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",title_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.createYearPlaceNgoofficer = async(req,res) => {
    try{
        console.log("req.body",req.body)
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'placeID missing')
        }else{
            await year_place_ngo_officer.create(req.body);
            return apiResponse.successResponse(res,'Year Place Ngo Officer saved successfully.')
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
            if(req.body.place_id){
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