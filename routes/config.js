const express = require('express');
const ConfigController = require('../controllers/ConfigController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');



router.put('/update_json_file/', ConfigController.update);
router.get('/get_json_data', ConfigController.get);

module.exports = router;