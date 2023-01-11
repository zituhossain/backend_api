const express = require('express');
const OverallCondiionPlaceController = require('../controllers/OverallCondiionPlaceController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_overall_condition_place',auth, OverallCondiionPlaceController.fetchallovealllcondition);
router.get('/all_overall_condition_place/:id',auth, OverallCondiionPlaceController.getoverallconditionbyid);
router.get('/all_overall_condition_place_id/:placeid',auth, OverallCondiionPlaceController.getoverallconditionbyplaceid);
router.post('/create_overall_condition_place',auth, OverallCondiionPlaceController.createoverallcondition);
router.post('/update_overall_condition_place/:id',auth, OverallCondiionPlaceController.updateoverallconditionbyid);

module.exports = router;
