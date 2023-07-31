const express = require('express');
const AuthController = require('../controllers/AuthController');
const auth = require('../middlewares/jwt');

const router = express.Router();

router.post('/register', auth, AuthController.register);
router.post('/login', AuthController.login);
router.put('/update_user/:id', auth, AuthController.updateUser);
router.put('/update_user_by_own/:id', auth, AuthController.updateUserByOwn);

module.exports = router;
