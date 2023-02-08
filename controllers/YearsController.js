const apiResponse = require('../helpers/apiResponse');
const {years} = require("../models");
exports.create = async(req,res) => {
    
    try{
        await years.create(req.body);
        return apiResponse.successResponse(res,"data successfully saved.")
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.get = async(req,res) => {
    const id = req.params.id;
    try{
       const data= await  years.findByPk(id);
        return apiResponse.successResponseWithData(res, "Data successfully fetched.", data)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.getAll = async(req,res) => {
    
    try{
       const data= await  years.findAll();
        return apiResponse.successResponseWithData(res, "Data successfully fetched.", data)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.update = async(req,res) => {
    const id = req.params.id;
    try{

         await years.update(req.body, {
            where:{id}
         });
         return apiResponse.successResponse(res,"data successfully updated.")
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }

 exports.delete = async(req,res) => {
    const id = req.params.id;
    try{
         
        await years.destroy({ where: { id } });
        return apiResponse.successResponse(res, "Data successfully deleted.")
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }