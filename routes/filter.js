const express = require('express');
const FilterController = require('../controllers/FilterController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/divisions', FilterController.divisions);
router.get('/district-by-id/:id', FilterController.districtById);
router.get('/places-by-distict-id/:id', FilterController.placesByDistricId);
router.get('/all_places', FilterController.placesByDistricId);
router.post(
	'/reportTest',
	auth,
	FilterController.reportTest
);
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
router.post(
	'/masterReport',
	auth,
	FilterController.masterReport
);
router.post(
	'/finalReportGenerate_double',
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
	'/finalReportGenerateResult',
	FilterController.finalReportGenerateResult
);
router.post(
	'/finalReportGenerateOfficerChange',
	FilterController.finalReportGenerateOfficerChange
);
router.get('/yearget/:year', FilterController.YearGet);
router.get('/latestyearget', auth, FilterController.LatestYearGet);

module.exports = router;
