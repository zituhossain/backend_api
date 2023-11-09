const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const base_dir_config = require('../config.js');

router.post('/create', CategoryController.createCategory);
router.put('/update/:id', CategoryController.updateCategory);
router.get('/getAll', CategoryController.getAllCategory);
router.get('/get/:id', CategoryController.getCategoryById);
router.delete('/delete/:id', CategoryController.deleteCategory);

module.exports = router;
