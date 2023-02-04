const apiResponse = require('../helpers/apiResponse');
const {ngo_categories} = require('../models');
exports.create = async(req,res) => {
   try{
        await ngo_categories.create(req.body);
        return apiResponse.successResponse(res,"data successfully saved.")
    } catch(e){
        return apiResponse.ErrorResponse(res,"Value missing.")
    }
}
exports.update = async(req,res) => {
    const id = req.params.id;
    try{

         await ngo_categories.update(req.body, {
            where:{id}
         });
         return apiResponse.successResponse(res,"data successfully updated.")
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }
 exports.get = async(req,res) => {
    const id = req.params.id;
    try{
         
         const categoryB = await ngo_categories.findByPk(req.params.id);
        if (categoryB) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", categoryB)
        } else {
            return apiResponse.ErrorResponse(res, "Division table is empty.")
        }
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }

 exports.getAll = async(req,res) => {
    try{
         console.log('------------------------------------------');
         const categoryB = await ngo_categories.findAll();
        if (categoryB) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", categoryB)
        } else {
            return apiResponse.ErrorResponse(res, "Division table is empty.")
        }
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }

 exports.delete = async(req,res) => {
    const id = req.params.id;
    try{
         
        await ngo_categories.destroy({ where: { id } });
        return apiResponse.successResponse(res, "Data successfully deleted.")
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }
