const express = require('express');
const PlaceController = require('../controllers/PlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_place',auth, PlaceController.getallPlace);
router.get('/all_division',auth, PlaceController.getallDivision);
router.get('/all_district',auth, PlaceController.getallDistrict);
router.post('/create_place',auth, PlaceController.createPlace);
router.get('/delete_place/:id',auth, PlaceController.deleteplacebyid);
router.post('/update_place/:id',auth, PlaceController.updatePlace);
router.get('/districtmap/:id',auth, PlaceController.getDistrictmap);
router.get('/get_district/:id',auth, PlaceController.getDistrict);
router.get('/get_division/:id',auth, PlaceController.getDivision);
router.get('/get_district_by_division_id/:id',auth, PlaceController.getDistrictByDivision);


module.exports = router;
