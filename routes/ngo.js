const express = require('express');
const NgoController = require('../controllers/NgoController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.post('/create',auth, NgoController.create_ngo);

module.exports = router;
