const express = require('express');
const OverallCondiionController = require('../controllers/OverallCondiionController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_overall_condition',auth, OverallCondiionController.fetchallovealllcondition);
router.get('/all_overall_condition/:id',auth, OverallCondiionController.getoverallconditionbyid);
router.post('/create_overall_condition',auth, OverallCondiionController.createoverallcondition);
router.get('/all_overall_condition_place_id/:placeid',auth, OverallCondiionController.getoverallconditionbyplacexid);
router.get('/all_overall_condition_district_division_id/:condition/:id',auth, OverallCondiionController.getoverallconditionbydivisiondistrictxid);
router.post('/update_overall_condition/:id',auth, OverallCondiionController.updateoverallconditionbyid);

module.exports = router;
