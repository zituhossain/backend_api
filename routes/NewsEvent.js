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
router.get('/fetch_news_by_id/:value/:id',auth, NewsEventController.fetch_news_event_by_id);
router.get('/delete_news_by_id/:id',auth, NewsEventController.delete_by_id);
router.get('/fetch_all_news',auth,NewsEventController.fetch_all_news);

module.exports = router;
