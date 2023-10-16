const express = require('express');
const auth = require('../middlewares/jwt');
const ReportController = require('../controllers/ReportController')
const router = express.Router();

router.get('/combine_report/:id', ReportController.combineDetailsReport);

router.post('/all_place_details_mongo', ReportController.getPlaceDetailsAllMongo);
router.get('/place_details_by_id_mongo/:id', ReportController.getPlaceDetailsByIdMongo);

module.exports = router;