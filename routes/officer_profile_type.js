const express = require('express');
const OfficerProfileTypeController = require('../controllers/OfficerProfileTypeController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_officer_profile_type',auth, OfficerProfileTypeController.fetchallTitle);
router.get('/all_officer_profile_type/:id',auth, OfficerProfileTypeController.getOfficerProfileTypeById);
router.post('/create_officer_profile_type',auth, OfficerProfileTypeController.createOfficerProfileType);
router.post('/update_officer_profile_type/:id',auth, OfficerProfileTypeController.updateoveralltitlebyid);

module.exports = router;

