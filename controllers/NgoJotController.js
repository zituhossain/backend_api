const {Op} = require('sequelize');
const {ngo_jots } = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")
const {ngoJotCreate} = require('../validator/ngoJot')
exports.create = async(req,res)=>{
    try{
        await ngoJotCreate.validateAsync({
            name:req.body.name,
            color_code:req.body.color_code,
        })
        await ngo_jots.create(req.body);
        return apiResponse.successResponse(res,'Data saved successfully.')
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.update = async(req,res)=>{
    const id = req.params.id;
    try{
        await ngoJotCreate.validateAsync({
            name:req.body.name,
            color_code:req.body.color_code,
        })
        await ngo_jots.update(req.body, { where: { id} });
        return apiResponse.successResponse(res, "Data successfully updated.")
        
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.get_details = async(req,res)=>{
    const id = req.params.id;
    try{
       
         const data = await ngo_jots.findByPk(id);
        return apiResponse.successResponseWithData(res, "Data successfully fetched.", data)
        
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.delete = async(req,res)=>{
    const id = req.params.id;
    try{
         const data = await ngo_jots.destroy({ where: { id } });
         return apiResponse.successResponse(res, "Data successfully deleted.")
        
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}