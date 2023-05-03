const express = require('express');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');
const upload = require("../middlewares/upload");


const ExcelController = require('../controllers/ExcelController');


let routes = (app) => {
    router.post("/upload", upload.single("file"), ExcelController.upload);

    app.use("/api/excel", router);
};

// router.post('/slide_image_upload', auth, multer({ storage }).single('myFile'), ImageController.custom_file_upload)


module.exports = routes;