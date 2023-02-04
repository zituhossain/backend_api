const express = require('express');
const CategoryBController = require('../controllers/CategoryBController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');


router.post('/create', CategoryBController.create);
router.put('/update/:id', CategoryBController.update);
router.get('/getAll', CategoryBController.getAll);
router.get('/get/:id', CategoryBController.get);
router.delete('/delete/:id', CategoryBController.delete);

module.exports = router;