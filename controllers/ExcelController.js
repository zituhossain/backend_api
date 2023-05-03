const multer = require('multer');
const { Tutorial } = require("../models");
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const sequelize = require('sequelize');
const base_dir_config = require('../config.js');

const readXlsxFile = require("read-excel-file/node");

const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }

        let path =
            // __basedir + "/uploads/" + req.file.filename;
            base_dir_config.base_dir + 'uploads/image_slider/' + req.file.filename

        readXlsxFile(path).then((rows) => {
            // skip header
            rows.shift();

            let tutorials = [];

            rows.forEach((row) => {
                let tutorial = {
                    id: row[0],
                    name: row[1],
                    address: row[2],
                    phone: row[3],
                };

                tutorials.push(tutorial);
            });

            Tutorial.bulkCreate(tutorials)
                .then(() => {
                    res.status(200).send({
                        message: "Uploaded the file successfully: " + req.file.originalname,
                    });
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: error.message,
                    });
                });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

module.exports = {
    upload,
};

// const segment2_create = async (req, res) => {

//     try{
//         const filePath = `uploads/image_slider/${req.file.filename}`
//         const token = req.headers.authorization.split(' ')[1];
// 		const decodedToken = jwt.verify(token, secret);
// 		const userId = decodedToken._id;
//         req.body.created_by = userId;
//         req.body.thumbnail = filePath;
//         if(req.body.title && req.body.title !== '' && req.body.link && req.body.link !== '' && req.body.ordering && req.body.ordering !== ''){
//             await Segment2_video.create(req.body)
//             return apiResponse.successResponse(res,"Successfully uploaded.")
//         }else{
//             return apiResponse.ErrorResponse(res,"title/link/ordering field is missing")
//         }
//     }catch(err){
//         return apiResponse.ErrorResponse(res,err.message)
//     }
// }

// module.exports = {custom_file_upload,fetchallimage,deletebyid,updatesliderbyid,segment2_create,segment2_fetch,update_segment2_byid,delete_segment2_byid};