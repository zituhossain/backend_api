const express = require('express');
const OfficerController = require('../controllers/OfficerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.post('/create_officer',auth, OfficerController.createofficer);
router.get('/all_officer',auth, OfficerController.getallofficer);
router.get('/all_active_officer',auth, OfficerController.getactiveofficer);
router.get('/all_deleted_officer',auth, OfficerController.getdeletedofficer);
router.get('/get_officer/:id',auth, OfficerController.getofficerbyid);
router.get('/delete_officer/:id',auth, OfficerController.deleteofficerbyid);
router.get('/activate_officer/:id',auth, OfficerController.activeofficerbyid);
router.post('/update_officer/:id',auth, OfficerController.updateofficerbyid);

module.exports = router;
