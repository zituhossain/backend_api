const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');

router.post('/create', CategoryController.create);
router.put('/update/:id', CategoryController.categoryUpdate);
router.get('/getAll', CategoryController.getAll);
router.get('/get/:id', CategoryController.get);
router.delete('/delete/:id', CategoryController.delete);

module.exports = router;
