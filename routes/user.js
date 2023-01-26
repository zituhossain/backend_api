const express = require('express');
const UserController = require('../controllers/UserController');
const UserRoleController = require('../controllers/UserRoleController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/deactivate/:id',auth, UserController.deactivateuser);
router.get('/activate/:id',auth, UserController.activateuser);
router.get('/alluser',auth, UserController.fetchalluser);
router.post('/create_role',auth, UserRoleController.createuserrole);
router.post('/update_role/:id',auth, UserRoleController.updateuserrole);
router.get('/all_role',auth, UserRoleController.getallrole);
router.get('/role_by_id/:id',auth, UserRoleController.getrolebyid);
router.get('/delete_role_by_id/:id',auth, UserRoleController.deleterolebyid);
router.get('/user_login_attempts',auth, UserController.getuserloginattempt);
router.post('/user_role_assign',auth, UserRoleController.assignuserrole);
router.post('/user_role_remove',auth, UserRoleController.removeuserrole);
router.get('/get_all_previlege_area',auth,UserRoleController.getallprevilegearea);
router.get('/get_previlege_area/:id',auth,UserRoleController.getprevilegeareabyid);
router.post('/create_previlege_area',auth,UserRoleController.createprevilegearea);
router.post('/update_previlege_area/:id',auth,UserRoleController.updateprevilegearea);
router.get('/delete_previlege_area/:id',auth,UserRoleController.deleteprevilegearea);

router.post('/create_previlege_url',auth,UserRoleController.createprevilegeurl);
router.post('/update_previlege_url/:id',auth,UserRoleController.updateprevilegeurl);
router.get('/all_previlege_url',auth,UserRoleController.getallprevilegeurl);
router.get('/delete_previlege_url/:id',auth,UserRoleController.deleteprevilegeurl);

router.post('/create_previlege_table',auth,UserRoleController.createprevilegetable);
router.post('/delete_previlege_table',auth,UserRoleController.deleteprevilegetable);
router.get('/get_previlege_table/:id',auth,UserRoleController.getprevilegetable);

module.exports = router;
