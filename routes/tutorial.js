const express = require('express');
const auth = require('../middlewares/jwt');
const router = express.Router();
// const multer = require('multer');
// const base_dir_config = require('../config.js');
const upload = require("../middlewares/upload");


const ExcelController = require('../controllers/ExcelController');


// let routes = (app) => {
//     router.post("/upload", upload.single("file"), ExcelController.upload);

//     app.use("/api/excel", router);
// };

router.post('/uploadxl', auth, upload.single('file'), ExcelController.upload)


module.exports = router;