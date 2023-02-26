const express = require('express');
const YearPlaceNgoOfficerController = require('../controllers/YearPlaceNgoOfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_year_place_ngo_officer_front',auth, YearPlaceNgoOfficerController.fetchYearPlaceNgoofficerFront);
router.get('/all_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.fetchYearPlaceNgoofficer);
router.get('/delete_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.deleteYearPlaceNgoofficer);
router.get('/all_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.getYearPlaceNgoofficerbyid);
router.get('/all_year_place_ngo_officer_place/:placeid',auth, YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyPlace);
router.get('/get_ngo_officer_headings/:officer_id/:year_id',auth, YearPlaceNgoOfficerController.getNgoOfficerHeadings);
router.get('/all_year_place_kormi/:condition/:id',auth, YearPlaceNgoOfficerController.getkormibyxid);
router.get('/all_year_place_kormi_top/:condition/:id',auth, YearPlaceNgoOfficerController.getkormitopbyxid);
router.get('/all_year_place_ngo_officer_year/:year/:id',auth, YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyYear);
router.get('/get_ngo_officer_exists/:year_id/:officer_id',auth, YearPlaceNgoOfficerController.getNgoOfficerExists);
router.get('/get_all_counter_info', YearPlaceNgoOfficerController.getAllCountInformation);
router.post('/create_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.createYearPlaceNgoofficer);
router.post('/update_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.updateoveralltitlebyid);
router.get('/get_ngo_popular_officer/:id',auth, YearPlaceNgoOfficerController.getNgoPopularOfficer);


module.exports = router;

