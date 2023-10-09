const express = require('express');
const TestController = require('../controllers/TestController');
//const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');;
console.log('hit');
router.get('/all_division', TestController.fetchDivisions);
router.get('/all_district', TestController.fetchDistricts);

module.exports = router;