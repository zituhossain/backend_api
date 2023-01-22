const express = require('express');
const YearPlaceNgoOfficerController = require('../controllers/YearPlaceNgoOfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.fetchallTitle);
router.get('/all_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.getoveralltitlebyid);
router.get('/all_year_place_ngo_officer_params/:params',auth, YearPlaceNgoOfficerController.getoveralltitlebyparams);
router.post('/create_year_place_ngo_officer',auth, YearPlaceNgoOfficerController.createoveralltitle);
router.post('/update_year_place_ngo_officer/:id',auth, YearPlaceNgoOfficerController.updateoveralltitlebyid);

module.exports = router;

