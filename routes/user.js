const express = require('express');
const UserController = require('../controllers/UserController');
const UserRoleController = require('../controllers/UserRoleController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/deactivate/:id',auth, UserController.deactivateuser);
router.get('/activate/:id',auth, UserController.activateuser);
router.get('/alluser',auth, UserController.fetchalluser);
router.post('/create_role',auth, UserRoleController.createuserrole);
router.get('/all_role',auth, UserRoleController.getallrole);
router.get('/role_by_id/:id',auth, UserRoleController.getrolebyid);
router.get('/user_login_attempts',auth, UserController.getuserloginattempt);

module.exports = router;
