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
router.get('/divisionmap/:id',auth, PlaceController.getDivisionmap);

router.post('/place_connect_with_ngo', PlaceController.placeConnectWithNgo);
router.post('/add_category_b', PlaceController.addCategoryB);
router.get('/place_details/:id', PlaceController.placeDetails);
router.get('/place_details', PlaceController.placeDetailsAll);

router.get('/place_history/:id', PlaceController.placeHistory);
router.get('/place_history_district/:id', PlaceController.placeHistoryDistrict);
router.get('/place_history_division/:id', PlaceController.placeHistoryDivision);



router.get('/get_district/:id',auth, PlaceController.getDistrict);
router.get('/get_division/:id',auth, PlaceController.getDivision);
router.get('/get_district_by_division_id/:id',auth, PlaceController.getDistrictByDivision);
router.get('/get_place_by_division_id/:id',auth, PlaceController.getPlacesByDivision);
router.post('/add_ngo_served_percent_by_place/',auth, PlaceController.addNgoServedPercent);
router.post('/ngo_jot_add_into_place/', PlaceController.ngoJotAddIntoPlace);
router.get('/all_ngo_jot_add_into_place/', PlaceController.allNgoJotAddIntoPlace);
router.get('/get_ngo_jot_list_by_place_id/:id', PlaceController.getNgoJotAddIntoPlaceId);
router.get('/get_ngo_jot_by_id/:id', PlaceController.getNgoJotById);
router.delete('/ngo_jot_delete_by_id/:id', PlaceController.ngoJotDeleteById);



module.exports = router;
