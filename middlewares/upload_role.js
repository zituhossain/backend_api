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

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, "C:/Users/User/Downloads/");
        cb(null, base_dir_config.base_dir + "uploads/imported_role_file/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, `${file.originalname}`);
    },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;