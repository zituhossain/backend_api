const express = require('express');
const OfficerProfileHeadingController = require('../controllers/OfficerProfileHeadingController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_officer_profile_heading',auth, OfficerProfileHeadingController.fetchallTitle);
router.get('/all_officer_profile_heading/:id',auth, OfficerProfileHeadingController.getoveralltitlebyid);
router.get('/all_officer_profile_heading_params/:params',auth, OfficerProfileHeadingController.getoveralltitlebyparams);
router.post('/create_officer_profile_heading',auth, OfficerProfileHeadingController.createOfficerProfileHeading);
router.post('/update_officer_profile_heading/:id',auth, OfficerProfileHeadingController.updateoveralltitlebyid);

module.exports = router;

