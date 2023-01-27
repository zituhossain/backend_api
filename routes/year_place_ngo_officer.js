const express = require('express');
const YearPlaceNgoOfficerController = require('../controllers/YearPlaceNgoOfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.fetchYearPlaceNgoofficer);
router.get('/all_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.getYearPlaceNgoofficerbyid);
router.get('/all_year_place_ngo_officer_place/:placeid',auth, YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyPlace);
router.get('/all_year_place_ngo_officer_year/:year/:id',auth, YearPlaceNgoOfficerController.getYearPlaceNgoOfficebyYear);
router.post('/create_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.createYearPlaceNgoofficer);
router.post('/update_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.updateoveralltitlebyid);

module.exports = router;

