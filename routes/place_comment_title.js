const express = require('express');
const PlaceCommentTitleController = require('../controllers/PlaceCommentTitleController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/get_all', auth, PlaceCommentTitleController.fetchallPlaceCommentTitle);
router.get('/get_by_id/:id', auth, PlaceCommentTitleController.getPlaceCommentTitleById);
router.get('/by_placeId/:placeid', auth, PlaceCommentTitleController.getPlaceCommentTitleByPlaceId);
router.get('/all_place_comment_title', auth, PlaceCommentTitleController.getAllPlaceCommentTitle);
router.get('/by_districtId/:districtid', auth, PlaceCommentTitleController.getPlaceCommentTitleByDistrictId);
router.get('/by_divisionId/:divisionid', auth, PlaceCommentTitleController.getPlaceCommentTitleByDivisionId);
router.post('/create', auth, PlaceCommentTitleController.createPlaceCommentTitle);
router.post('/update/:id', auth, PlaceCommentTitleController.updatePlaceCommentTitle);

module.exports = router;
