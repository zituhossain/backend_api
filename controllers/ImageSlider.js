const multer = require('multer');
const {Image_slider,Segment2_video} = require("../models");
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const sequelize = require('sequelize');

const custom_file_upload = async (req, res) => {
    // This needs to be done elsewhere. For this example we do it here.
    // await sequelize.sync()

    const filePath = `uploads/image_slider/${req.file.filename}`
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const myModel = await Image_slider.create({ filename: filePath,user_id:userId,ordering:req.body.ordering })
        return apiResponse.successResponse(res,"Successfully uploaded.")
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

const fetchallimage = async(req,res) => {
    try{
        const slider_data = await Image_slider.findAll({
            order: [
                [sequelize.literal('ordering'), 'ASC']
            ]
        });
        if(slider_data){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",slider_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

const deletebyid = async(req,res) => {
    try{
        const slider_id = req.params.id;
        const slider_data = await Image_slider.findOne({where:{id: slider_id}});
        if(slider_data){
            await Image_slider.destroy({where:{id: slider_id}});
            return apiResponse.successResponse(res,"Data successfully deleted.")
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
const updatesliderbyid = async(req,res) => {
    let filePath = ''
    try{
        filePath = `uploads/image_slider/${req.file.filename}`
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const slider_id = req.params.id;
        const slider_data = await Image_slider.findOne({where:{id: slider_id}});
        if(slider_data){
            await Image_slider.update({ filename: filePath,user_id:userId,ordering:req.body.ordering },{where:{id:slider_id}})
            
            return apiResponse.successResponse(res,"Data successfully updated.")
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

const segment2_create = async (req, res) => {

    try{
        const filePath = `uploads/image_slider/${req.file.filename}`
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;
        req.body.thumbnail = filePath;
        if(req.body.title && req.body.title !== '' && req.body.link && req.body.link !== '' && req.body.ordering && req.body.ordering !== ''){
            await Segment2_video.create(req.body)
            return apiResponse.successResponse(res,"Successfully uploaded.")
        }else{
            return apiResponse.ErrorResponse(res,"title/link/ordering field is missing")
        }
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

const segment2_fetch = async (req, res) => {

    try{
        const segment_data = await Segment2_video.findAll({
            order: [
                [sequelize.literal('ordering'), 'ASC']
            ],
            where:{visibility:true}
        });
        if(segment_data){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",segment_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
const update_segment2_byid = async(req,res) => {
    let filePath = ''
    try{
        filePath = `uploads/image_slider/${req.file.filename}`;
        req.body.thumbnail = filePath;
    }catch(err){
        // return apiResponse.ErrorResponse(res,err.message)
    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const segment_id = req.params.id;
        const segment_data = await Segment2_video.findOne({where:{id: segment_id}});
        req.body.updated_by = userId;
        if(segment_data){
            await Segment2_video.update(req.body,{where:{id:segment_id}})
            
            return apiResponse.successResponse(res,"Data successfully updated.")
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

const delete_segment2_byid = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const segment_id = req.params.id;
        const segment_data = await Segment2_video.findOne({where:{id: segment_id}});
        req.body.updated_by = userId;
        req.body.visibility = false;
        if(segment_data){
            await Segment2_video.update(req.body,{where:{id:segment_id}})
            
            return apiResponse.successResponse(res,"Data successfully deleted.")
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
module.exports = {custom_file_upload,fetchallimage,deletebyid,updatesliderbyid,segment2_create,segment2_fetch,update_segment2_byid,delete_segment2_byid};