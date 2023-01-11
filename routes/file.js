const express = require('express');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');


const ImageController = require('../controllers/ImageSlider');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, base_dir_config.base_dir + 'uploads/image_slider/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

router.post('/slide_image_upload', auth, multer({ storage }).single('myFile'), ImageController.custom_file_upload)
router.get('/fetch_slider_data', auth, ImageController.fetchallimage);
router.get('/delete_image_slider/:id', auth, ImageController.deletebyid);
router.post('/update_image_slider/:id', auth, multer({ storage }).single('myFile'), ImageController.updatesliderbyid);


router.post('/segement2_create', auth, multer({ storage }).single('myFile'), ImageController.segment2_create);
router.get('/segement2_fetch', auth, ImageController.segment2_fetch);


module.exports = router;