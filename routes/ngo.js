const express = require('express');
const NgoController = require('../controllers/NgoController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, base_dir_config.base_dir + 'uploads/logo/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

router.post(
	'/create',
	auth,
	multer({ storage }).single('myFile'),
	NgoController.create_ngo
);
router.post(
	'/update/:id',
	auth,
	multer({ storage }).single('myFile'),
	NgoController.update_ngo
);
router.get('/get_by_id/:id', auth, NgoController.fetchById);
router.get('/get_by_place_id/:id', auth, NgoController.fetchall_by_place_id);
router.get('/get_all_ngo', auth, NgoController.fetchall_ngo);
router.get('/get_other_ngo', NgoController.fetchOtherNgo);
router.get('/get_ngo_categoris', NgoController.fetchNgoCategoris);
router.get('/get_ngo_type', NgoController.fetchNgoType);
router.get(
	'/get_ngo_categoris_count',
	auth,
	NgoController.fetchNgoCategorisCount
);
router.get(
	'/get_ngo_categoris_count_by_division/:id',
	NgoController.fetchNgoCategorisCountByDivision
);
router.get('/get_ngo_list_by_place/:id', NgoController.fetchall_ngo_by_place);
router.get(
	'/get_year_ngo_place_list',
	auth,
	NgoController.fetchall_year_place_ngo
);
router.get(
	'/get_ngo_categoris_by_place/:id',
	NgoController.fetchNgoCategorisByPlace
);
// router.get('/get_ngo_type_by_place/:id', NgoController.fetchNgoTypeByPlace);
router.get('/delete_by_id/:id', auth, NgoController.delete_by_id);
router.get('/ngoCounter', auth, NgoController.NgoCounter);

module.exports = router;
