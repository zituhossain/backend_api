const {News_event} = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")

exports.create_news_event = async(req,res) => {
    try{
        const filePath = `uploads/news_event/${req.file.filename}`;
        req.body.image = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;

        if(req.body){
            await News_event.create(req.body);
            return apiResponse.successResponse(res,"data successfully saved.")
        }else{
            return apiResponse.ErrorResponse(res,"Value missing.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}