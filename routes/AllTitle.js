const express = require('express');
const AllTitleController = require('../controllers/AllTitleController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_title',auth, AllTitleController.fetchallTitle);
router.get('/all_title/:id',auth, AllTitleController.getoveralltitlebyid);
router.get('/all_title_by_params/:params',auth, AllTitleController.getoveralltitlebyparams);
router.post('/create_title',auth, AllTitleController.createoveralltitle);
router.post('/update_title/:id',auth, AllTitleController.updateoveralltitlebyid);

module.exports = router;

