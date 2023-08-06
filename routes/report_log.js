const express = require('express');
const auth = require('../middlewares/jwt');
const ReportLogController = require('../controllers/ReportLogController');
const router = express.Router();

router.post('/genarate-report-log', auth, ReportLogController.reportLog);
router.get('/get-report-log', auth, ReportLogController.getAllReportLogData);

module.exports = router;
