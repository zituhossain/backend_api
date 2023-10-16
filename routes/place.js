const express = require('express');
const PlaceController = require('../controllers/PlaceController');
const ExcelFileUploadController = require('../controllers/ExcelFileUploadController');
const auth = require('../middlewares/jwt');
const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/place_list', auth, PlaceController.getPlaceList);
router.get('/all_place', auth, PlaceController.getallPlace);
router.get('/all_division', auth, PlaceController.getallDivision);
router.get('/all_division_for_map', auth, PlaceController.getallDivisionForMap);
router.get('/all_district', auth, PlaceController.getallDistrict);
router.post('/create_place', auth, PlaceController.createPlace);
router.get('/delete_place/:id', auth, PlaceController.deleteplacebyid);
router.post('/update_place/:id', auth, PlaceController.updatePlace);
router.get('/districtmap/:id', auth, PlaceController.getDistrictmap);
router.get('/divisionmap/:id', auth, PlaceController.getDivisionmap);
router.get(
	'/placeCountByDivision/:id',
	auth,
	PlaceController.PlaceCountByDivisionId
);
router.get(
	'/placeCountByDistrict/:id',
	auth,
	PlaceController.PlaceCountByDistrictId
);

router.post('/place_connect_with_ngo', PlaceController.placeConnectWithNgo);
router.post('/add_category_b', PlaceController.addCategoryB);

// Place Category Type Route
router.post(
	'/create_place_category_type',
	PlaceController.createPlaceCategoryType
);
router.put(
	'/update_place_category_type/:id',
	PlaceController.updatePlaceCategoryType
);
router.delete(
	'/delete_place_category_type/:id',
	PlaceController.deletePlaceCategoryType
);
router.get('/get_place_category_type', PlaceController.getPlaceCategoryType);

router.get('/place_details_map', PlaceController.placeDetailsForMap);
router.get('/place_details/:id', PlaceController.placeDetails);
router.get('/place_details', PlaceController.placeDetailsAll);
router.post('/all_place_details', PlaceController.allPlaceDetails);
router.post('/all_place_details_pagination', PlaceController.allPlaceDetailsPagination);

// router.post('/all_place_details_mongo', PlaceController.getPlaceDetailsAllMongo);
// router.get('/place_details_by_id_mongo/:id', PlaceController.getPlaceDetailsByIdMongo);

router.get('/place_history/:id', auth, PlaceController.placeHistory);
router.get(
	'/place_history_district/:id',
	auth,
	PlaceController.placeHistoryDistrict
);
router.get(
	'/place_history_division/:id',
	auth,
	PlaceController.placeHistoryDivision
);

router.get('/all_place_history', auth, PlaceController.AllPlaceHistory);

router.get('/get_district/:id', auth, PlaceController.getDistrict);
router.get('/get_division/:id', auth, PlaceController.getDivision);
router.get(
	'/get_district_by_division_id/:id',
	auth,
	PlaceController.getDistrictsByDivision
);
router.get(
	'/get_place_by_division_id/:id',
	auth,
	PlaceController.getPlacesByDivision
);
router.get(
	'/get_place_by_district_id/:id',
	auth,
	PlaceController.getPlacesByDistrict
);
router.post(
	'/add_ngo_served_percent_by_place/',
	auth,
	PlaceController.addNgoServedPercent
);
router.get(
	'/get_ngo_served_percent_by_place/:id',
	auth,
	PlaceController.getNgoServedPercent
);
router.post('/ngo_jot_add_into_place', PlaceController.ngoJotAddIntoPlace);
router.get(
	'/all_ngo_jot_add_into_place',
	PlaceController.allNgoJotAddIntoPlace
);
router.get(
	'/get_ngo_jot_list_by_place_id/:id',
	PlaceController.getNgoJotAddIntoPlaceId
);
router.get(
	'/get_joter_jonosomorthon_by_place_id/:id',
	PlaceController.getJoterJonoSomorthon
);
router.get('/get_ngo_jot_by_id/:id', PlaceController.getNgoJotById);
router.delete('/ngo_jot_delete_by_id/:id', PlaceController.ngoJotDeleteById);

router.get('/categoryAlist', PlaceController.categoryAlist);
router.get('/categoryBlist', PlaceController.categoryBlist);
router.get('/categoryBlist/:id', PlaceController.categoryBlistID);
router.get('/categoryBColor', auth, PlaceController.categoryBColor);
router.get(
	'/categoryBColorByDivision/:id',
	PlaceController.categoryBColorByDivision
);

// Sub Place Route
router.post('/create_sub_place', auth, PlaceController.createSubPlace);
router.get('/all_sub_place', auth, PlaceController.fetchallSubPlace);
router.get(
	'/sub_place_by_place_id/:id',
	auth,
	PlaceController.fetchSubPlaceByPlaceId
);
router.delete('/delete_sub_place/:id', auth, PlaceController.deleteSubPlace);
router.put('/update_sub_place/:id', auth, PlaceController.updateSubPlace);

// Sub Place Excel file Upload
router.post(
	'/sub_place_excel',
	auth,
	upload.single('file'),
	ExcelFileUploadController.upload
);

// Upazilla Route
router.get('/all_upazilla', auth, PlaceController.fetchallUpazilla);
router.post('/create_upazilla', auth, PlaceController.createUpazilla);

router.get(
	'/all_upazilla_by_place_id/:id',
	auth,
	PlaceController.fetchallUpazillaByPlaceId
);
router.delete('/delete_upazilla/:id', auth, PlaceController.deleteUpazilla);
router.put('/update_upazilla/:id', auth, PlaceController.updateUpazilla);

// Union Route
router.post('/create_union', auth, PlaceController.createUnion);
router.get('/all_union', auth, PlaceController.fetchallUnion);
router.get(
	'/all_union_by_upazilla_id/:id',
	auth,
	PlaceController.fetchallUnionByUpazillaId
);
router.delete('/delete_union/:id', auth, PlaceController.deleteUnion);
router.put('/update_union/:id', auth, PlaceController.updateUnion);

module.exports = router;
