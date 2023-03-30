const {Op} = require('sequelize');
const {ngo_jots } = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")
const {ngoJotCreate} = require('../validator/ngoJot');
const ngo_jot = require('../models/ngo_jot');
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

exports.get_detailsAll = async(req,res)=>{
    try{
       
         const data = await ngo_jots.findAll();
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

exports.fetchall_ngojot_by_place = async (req, res) => {
    const place_id = req.params.id;
    try {
        const ngojot_data = await ngo_jot.findAll({
            include: [
                {
                    model: ngo_jot_add_into_place,
                    where: { place_id: place_id },
                    required: false,
                },
                // {
                //     model: Place,
                //     where: { id: place_id },
                //     required: false,
                // }
            ]
        });

        const place_data = await Place.findOne({ where: { id: place_id }, raw: true });


        // Create a new array that contains the NGO id, name, and percent

        const result = [];
        ngojot_data.forEach((ngojot) => {
        console.log("-----------------------------ngojot_data--------------------------",ngojot.Place)
            const percentData = ngojot.ngo_jot_add_into_place;
            const percent = percentData && percentData.length > 0 ? percentData[0].percent : null;
            result.push({ id: ngojot.id, name: ngojot.name, percent , ngoJotID : place_data?.ngo_jot_id});
        });

        if (result.length > 0) {
            return apiResponse.successResponseWithData(res, "Data fetch successful.", result);
        } else {
            return apiResponse.ErrorResponse(res, "No data found!!!");
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
}