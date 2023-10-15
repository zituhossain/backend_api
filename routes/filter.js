const express = require('express');
const FilterController = require('../controllers/FilterController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/divisions', FilterController.divisions);
router.get('/places_by_distict_id/:id', FilterController.placesByDistricId);
router.get('/district_by_division_id/:id', FilterController.districtsByDivisionId);

router.post('/reportTest', auth, FilterController.reportTest);
router.post(
	'/finalReportGenerateCategory',
	auth,
	FilterController.finalReportGenerateCategory
);
router.post(
	'/finalReportGenerateJot',
	auth,
	FilterController.finalReportGenerateJot
);
router.post(
	'/finalReportGenerateJotPopularity',
	auth,
	FilterController.finalReportGenerateJotPopularity
);
router.post(
	'/finalReportGenerate_possibility_jot',
	auth,
	FilterController.finalReportGeneratePossibilityJot
);
router.post('/masterReport', auth, FilterController.masterReport);
router.post('/popularityReport', auth, FilterController.popularityReport);
router.post(
	'/finalReportGenerate_double',
	auth,
	FilterController.finalReportGenerateDoubleNGO
);
router.post(
	'/finalReportGenerateOfficerProfile',
	auth,
	FilterController.finalReportGenerateOfficerProfileNGO
);
router.post(
	'/finalReportGenerateAdminOfficer',
	auth,
	FilterController.finalReportGenerateAdminOfficer
);
router.post(
	'/finalReportGenerateAdminOfficerCounter',
	auth,
	FilterController.finalReportGenerateAdminOfficerCounter
);
router.post(
	'/finalReportGenerateResult',
	auth,
	FilterController.finalReportGenerateResult
);
router.post(
	'/finalReportGenerateOfficerChange',
	auth,
	FilterController.finalReportGenerateOfficerChange
);
router.get('/yearget/:year', FilterController.YearGet);
router.get('/latestyearget', auth, FilterController.LatestYearGet);

module.exports = router;
