const sequelize = require('sequelize');
const {Ngo} = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")

exports.create_ngo = async(req,res) => {
    try{
        const filePath = `uploads/logo/${req.file.filename}`;
        req.body.logo = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;

        if(req.body){
            await Ngo.create(req.body);
            return apiResponse.successResponse(res,"data successfully saved.")
        }else{
            return apiResponse.ErrorResponse(res,"Value missing.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.fetchall_by_place_id = async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const ngo_data = await Ngo.findAll({where: {place_id : ngo_id}});
        if(ngo_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}