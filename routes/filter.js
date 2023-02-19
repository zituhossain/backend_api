const express = require('express');
const FilterController = require('../controllers/FilterController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/divisions', FilterController.divisions);
router.get('/district-by-id/:id', FilterController.districtById);
router.get('/places-by-distict-id/:id', FilterController.placesByDistricId);
router.get('/all_places', FilterController.placesByDistricId);
router.post('/finalReportGenerate',FilterController.finalReportGenerate);
router.post('/finalReportGenerate_double',FilterController.finalReportGenerateDoubleNGO);

module.exports = router;
