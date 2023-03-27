const express = require('express');
const NgoDetailPointWiseController = require('../controllers/NgoDetailPointWiseController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_ngo_details_info_point_wise',auth, NgoDetailPointWiseController.fetchalllocalinfluencer);
router.get('/all_ngo_details_info_point_wise/:id',auth, NgoDetailPointWiseController.getlocalinfluencerbyid);
router.get('/all_ngo_details_info_placeId_point_wise/:placeid',auth, NgoDetailPointWiseController.getNgoDetailPointWisebyplaceid);
router.post('/create_ngo_datails_point_wise',auth, NgoDetailPointWiseController.createNgoDetailPointWise);
router.post('/update_ngo_details_point_wise/:id',auth, NgoDetailPointWiseController.updatelocalinfluencerbyid);
router.get('/deleteNgoDetailPointWiseById/:id',auth, NgoDetailPointWiseController.deleteNgoDetailPointWiseById);

module.exports = router;
