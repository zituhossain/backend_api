const express = require('express');
const YearsController = require('../controllers/YearsController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');



router.post('/create', YearsController.create);
router.get('/get/:id', YearsController.get);
router.put('/update/:id', YearsController.update);
router.get('/getAll', YearsController.getAll);
router.delete('/delete/:id', YearsController.delete);

module.exports = router;