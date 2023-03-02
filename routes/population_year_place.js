const express = require('express');
const PopulationYearPlaceController = require('../controllers/PopulationYearPlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_population_year_place',auth, PopulationYearPlaceController.fetchall);
router.get('/all_population_year_place/:id',auth, PopulationYearPlaceController.getbyid);
router.get('/all_population_year_place_by_place/:place',auth, PopulationYearPlaceController.getbyYear);
router.get('/all_population_year_place_by_district/:disId',auth, PopulationYearPlaceController.getbyDisId);
router.get('/all_population_year_place_by_division/:divId',auth, PopulationYearPlaceController.getbyDivId);

router.post('/create_population_year_place',auth, PopulationYearPlaceController.create);
router.post('/update_population_year_place/:id',auth, PopulationYearPlaceController.updatebyid);

module.exports = router;

