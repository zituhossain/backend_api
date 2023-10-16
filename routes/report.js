const express = require('express');
const auth = require('../middlewares/jwt');
const ReportController = require('../controllers/ReportController')
const router = express.Router();

router.get('/combine_report/:id', ReportController.combineDetailsReport);

module.exports = router;