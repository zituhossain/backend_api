const express = require('express');
const AdministrationController = require('../controllers/Administration');
const auth = require('../middlewares/jwt');
const router = express.Router();


router.post('/create_administration_office',auth, AdministrationController.create);
router.get('/fetchall_administration_office',auth, AdministrationController.fetchall);
router.get('/delete_administration_office/:id',auth, AdministrationController.delete);
router.post('/update_administration_office/:id',auth, AdministrationController.update);

router.post('/create_place_comment',auth, AdministrationController.place_comment_create);
router.get('/place_comment/:id',auth, AdministrationController.getplacecommentbyid);
router.get('/place_comment_delete/:id',auth, AdministrationController.place_comment_delete);
router.post('/place_comment_update/:id',auth, AdministrationController.place_comment_update);


router.post('/create_administration_officer',auth, AdministrationController.create_administration_officer);

module.exports = router;
