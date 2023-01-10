const apiResponse = require('../helpers/apiResponse');
const {User_role,Previlege_area} = require('../models');
const db = require('../db/db');

exports.createuserrole = async(req,res) => {
    try{
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'name,permission,previlege_id missing')
        }else{
            await User_role.create(req.body);
            return apiResponse.successResponse(res,'role saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getallrole = async(req,res) => {
    try{
        const role_data = await User_role.findAll({
            include: [Previlege_area]
          });
        if(role_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",role_data)
        }else{
            return apiResponse.ErrorResponse(res,"Role table is empty.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getrolebyid = async(req,res) => {
    try{
        const role_id = req.params.id;
        const role_data = await User_role.findOne({where:{id: role_id}});
        if(role_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",role_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}