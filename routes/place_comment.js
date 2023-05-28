const express = require('express');
const PlaceCommentController = require('../controllers/PlaceCommentController');
const auth = require('../middlewares/jwt');
const router = express.Router();

router.get(
	'/get_all',
	auth,
	PlaceCommentController.fetchAllComments
);
router.get(
	'/get_by_id/:id',
	auth,
	PlaceCommentController.getCommentsById
);
router.get(
	'/get_by_plae_id_and_title_id/:placeid/:titleId',
	auth,
	PlaceCommentController.getCommentsByPlaceIdAndTitleId
);
router.post(
	'/create',
	auth,
	PlaceCommentController.createComments
);
router.post(
	'/update/:id',
	auth,
	PlaceCommentController.updateCommentById
);
router.get(
	'/delete/:id',
	auth,
	PlaceCommentController.deleteCommentById
);

module.exports = router;
