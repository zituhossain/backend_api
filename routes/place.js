const express = require('express');
const PlaceController = require('../controllers/PlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_place',auth, PlaceController.getallPlace);
router.get('/all_division',auth, PlaceController.getallDivision);
router.get('/all_district',auth, PlaceController.getallDistrict);
router.post('/create_place',auth, PlaceController.createPlace);
router.get('/delete_place/:id',auth, PlaceController.deleteplacebyid);
router.post('/update_place/:id',auth, PlaceController.updatePlace);
router.get('/districtmap/:id',auth, PlaceController.getDistrictmap);


module.exports = router;
