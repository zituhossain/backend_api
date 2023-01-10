const multer = require('multer');
const {Image_slider} = require("../models");
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const sequelize = require('sequelize');

// const custom_storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         console.log(req);
//         callback(null, '../uploads');
//     },
//     filename: (req, file, callback) => {
//         console.log(req);
//         callback(null, Date.now() + file.originalname);
//     }
// });
// var upload = multer({storage:custom_storage}).single('myFile');

// const custom_file_upload = (req,res) => {
// 	upload(req,res,function(err){
// 		if (err)
// 			return res.end("error uploading file");
// 		res.end("file is uploaded");
// 	});
// }
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
module.exports = {custom_file_upload,fetchallimage,deletebyid,updatesliderbyid};