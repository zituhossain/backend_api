const express = require('express');
const YearPlaceNgoOfficerController = require('../controllers/YearPlaceNgoOfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get(
	'/ypno_profile_heading_detail_list',
	auth,
	YearPlaceNgoOfficerController.fetchYearPlaceNgoofficerProfileHeadingDetailList
);
router.get(
	'/all_year_place_ngo_officer',
	auth,
	YearPlaceNgoOfficerController.fetchYearPlaceNgoofficer
);
router.get(
	'/delete_year_place_ngo_officer/:id',
	auth,
	YearPlaceNgoOfficerController.deleteYearPlaceNgoofficer
);
router.get(
	'/all_year_place_ngo_officer/:id',
	auth,
	YearPlaceNgoOfficerController.getYearPlaceNgoofficerbyid
);
router.get(
	'/all_year_place_ngo_officer_place/:placeid',
	auth,
	YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyPlace
);
router.get(
	'/get_ngo_officer_headings/:officer_id/:year_id',
	auth,
	YearPlaceNgoOfficerController.getNgoOfficerHeadings
);
router.get(
	'/all_year_place_kormi/:condition/:id',
	auth,
	YearPlaceNgoOfficerController.getkormibyxid
);
router.get(
	'/get_kormi_top/:condition/:id',
	auth,
	YearPlaceNgoOfficerController.getkormitopbyxid
);
router.post(
	'/get_year_place_ngo_officers_with_conditions',
	auth,
	YearPlaceNgoOfficerController.getYearPlaceNgoOfficersWithConditions
);

router.post(
	'/get_nominated_year_place_ngo_officers',
	auth,
	YearPlaceNgoOfficerController.getNominatedYearPlaceNgoOfficers
);

router.post(
	'/get_year_place_ngo_officers_with_conditions_for_map',
	auth,
	YearPlaceNgoOfficerController.getYearPlaceNgoOfficersWithConditionsForMap
);

router.get(
	'/by_yearId_and_id/:year/:id',
	auth,
	YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyYear
);
router.get(
	'/get_ngo_officer_exists/:year_id/:officer_id',
	auth,
	YearPlaceNgoOfficerController.getNgoOfficerExists
);
router.get(
	'/get_all_counter_info',
	auth,
	YearPlaceNgoOfficerController.getAllCountInformation
);
router.post(
	'/create_year_place_ngo_officer',
	auth,
	YearPlaceNgoOfficerController.createYearPlaceNgoofficer
);
router.post(
	'/update_year_place_ngo_officer/:id',
	auth,
	YearPlaceNgoOfficerController.updateoveralltitlebyid
);
router.get(
	'/get_ngo_popular_officer/:id',
	auth,
	YearPlaceNgoOfficerController.getNgoPopularOfficer
);
router.get(
	'/get_ngo_final_officer/:id',
	auth,
	YearPlaceNgoOfficerController.getNgoFinalOfficer
);
router.get(
	'/get_poribortito_officer',
	auth,
	YearPlaceNgoOfficerController.getPlaceCountWithPoribortitoOfficer
);

router.get(
	'/get_all_updated_data_log_from_mongo',
	auth,
	YearPlaceNgoOfficerController.getAllUpdatedDataLogMongo
);
router.get(
	'/get_updated_data_log_from_mongo/:id',
	auth,
	YearPlaceNgoOfficerController.getUpdatedDataLogMongoByid
);

module.exports = router;
