const multer = require("multer");
const base_dir_config = require('../config.js');

const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
    ) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __basedir + "/uploads/");
//     },
//     filename: (req, file, cb) => {
//         console.log(file.originalname);
//         cb(null, `${Date.now()}-xl-${file.originalname}`);
//     },
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, base_dir_config.base_dir + 'uploads/image_slider/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;