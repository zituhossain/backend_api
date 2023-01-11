const express = require('express');
const LocalInfluencerController = require('../controllers/LocalInfluencerController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get('/all_local_influencer',auth, LocalInfluencerController.fetchalllocalinfluencer);
router.get('/all_local_influencer/:id',auth, LocalInfluencerController.getlocalinfluencerbyid);
router.get('/all_local_influencer_place/:placeid',auth, LocalInfluencerController.getlocalinfluencerbyplaceid);
router.post('/create_local_influencer',auth, LocalInfluencerController.createlocalinfluencer);
router.post('/update_local_influencer/:id',auth, LocalInfluencerController.updatelocalinfluencerbyid);

module.exports = router;
