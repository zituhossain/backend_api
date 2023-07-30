const express = require('express');
const auth = require('../middlewares/jwt');
const SettingsController = require('../controllers/SettignsController')
const router = express.Router();

router.post('/create-setting', auth, SettingsController.createSetting);
router.get('/get-all-settings', auth, SettingsController.getAllSettings);
router.get('/get-settings-by-id/:id', auth, SettingsController.getSettingById);
router.put('/update-settings-by-id/:id', auth, SettingsController.updateSettingById);
router.get('/activate/:id', auth, SettingsController.activateSetting);
router.get('/deactivate/:id', auth, SettingsController.deactivateSetting);

module.exports = router;
