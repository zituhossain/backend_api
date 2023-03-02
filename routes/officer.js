const express = require('express');
const OfficerController = require('../controllers/OfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, base_dir_config.base_dir + 'uploads/officer/')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name+"_"+file.originalname)
    }
})

router.post('/create_officer',auth,multer({ storage }).single('image'), OfficerController.createofficer);
router.get('/all_officer',auth, OfficerController.getallofficer);
router.get('/getOfficerInfo/:officer_id/:place_id',auth, OfficerController.getOfficerInfoById);
router.get('/getOfficerHeadingById/:officer_id/:place_id',auth, OfficerController.getOfficerHeadingById);
router.get('/all_active_officer',auth, OfficerController.getactiveofficer);
router.get('/all_deleted_officer',auth, OfficerController.getdeletedofficer);
router.get('/get_officer/:id',auth, OfficerController.getofficerbyid);
router.get('/get_officer_history/:id',auth, OfficerController.getOfficerHistory);
router.get('/delete_officer/:id',auth, OfficerController.deleteofficerbyid);
router.get('/activate_officer/:id',auth, OfficerController.activeofficerbyid);
router.post('/update_officer/:id',auth,multer({ storage }).single('image'), OfficerController.updateofficerbyid);

module.exports = router;
