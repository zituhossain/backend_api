const express = require('express');
const NewsEventController = require('../controllers/NewsEventController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, base_dir_config.base_dir + 'uploads/news_event/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

router.post('/create',auth,multer({ storage }).single('myFile'), NewsEventController.create_news_event);
router.post('/update/:id',auth,multer({ storage }).single('myFile'), NewsEventController.update_news_event);

module.exports = router;
