const express = require('express');
const DetailYearPlaceController = require('../controllers/DetailYearPlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_detail_year_place',auth, DetailYearPlaceController.fetchall);
router.get('/all_detail_year_place/:id',auth, DetailYearPlaceController.getbyid);
router.get('/all_detail_year_place_by_place/:place',auth, DetailYearPlaceController.getbyYear);
router.post('/create_detail_year_place',auth, DetailYearPlaceController.create);
router.post('/update_detail_year_place/:id',auth, DetailYearPlaceController.updatebyid);

module.exports = router;

