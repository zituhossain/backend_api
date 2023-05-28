const express = require('express');
const PopulationYearPlaceController = require('../controllers/PopulationYearPlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/get_all',auth, PopulationYearPlaceController.fetchall);
router.get('/get_by_id/:id',auth, PopulationYearPlaceController.getbyid);

router.post('/get_by_condition',auth, PopulationYearPlaceController.getbyCondition);
router.get('/get_by_place_with_year/:place',auth, PopulationYearPlaceController.getbyYear);

router.get('/by_placeId/:placeId',auth, PopulationYearPlaceController.getbyPlaceId);
router.get('/by_districtId/:disId',auth, PopulationYearPlaceController.getbyDisId);
router.get('/by_divisionId/:divId',auth, PopulationYearPlaceController.getbyDivId);

router.get('/minorit_by_placeId/:placeId',auth, PopulationYearPlaceController.getMinoritybyPlaceId);

router.post('/create',auth, PopulationYearPlaceController.create);
router.post('/update/:id',auth, PopulationYearPlaceController.updatebyid);

module.exports = router;

