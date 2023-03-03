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
router.post('/finalReportGenerateOfficerProfile',FilterController.finalReportGenerateOfficerProfileNGO);
router.post('/finalReportGenerateAdminOfficer',FilterController.finalReportGenerateAdminOfficer);
router.post('/finalReportGenerateResult',FilterController.finalReportGenerateResult);
router.post('/finalReportGenerateOfficerChange',FilterController.finalReportGenerateOfficerChange);

module.exports = router;
