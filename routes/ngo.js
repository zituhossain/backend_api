const express = require('express');
const NgoController = require('../controllers/NgoController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, base_dir_config.base_dir + 'uploads/logo/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

router.post('/create',auth,multer({ storage }).single('myFile'), NgoController.create_ngo);
router.post('/update/:id',auth,multer({ storage }).single('myFile'), NgoController.update_ngo);
router.get('/get_by_place_id/:id',auth, NgoController.fetchall_by_place_id);
router.get('/get_all_ngo',auth, NgoController.fetchall_ngo);
router.get('/delete_by_id/:id',auth, NgoController.delete_by_id);

module.exports = router;
