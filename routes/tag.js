const express = require('express');
const TagController = require('../controllers/TagController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_tag',auth, TagController.fetchallovealllcondition);
router.get('/all_overall_condition/:id',auth, TagController.getoverallconditionbyid);
router.post('/create_overall_condition',auth, TagController.createoverallcondition);
router.get('/all_overall_condition_place_id/:placeid',auth, TagController.getoverallconditionbyplacexid);
router.post('/update_overall_condition/:id',auth, TagController.updateoverallconditionbyid);

module.exports = router;
