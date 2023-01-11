const express = require('express');
const NgoDetailController = require('../controllers/NgoDetailController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_ngo_details_info',auth, NgoDetailController.fetchalllocalinfluencer);
router.get('/all_ngo_details_info/:id',auth, NgoDetailController.getlocalinfluencerbyid);
router.get('/all_ngo_details_info_placeId/:placeid',auth, NgoDetailController.getlocalinfluencerbyplaceid);
router.post('/create_ngo_datails',auth, NgoDetailController.createlocalinfluencer);
router.post('/update_ngo_details/:id',auth, NgoDetailController.updatelocalinfluencerbyid);

module.exports = router;
