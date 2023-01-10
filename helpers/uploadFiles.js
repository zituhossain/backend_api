require('dotenv').config();

const path = require('path');
const multer = require('multer');
const { makeSlug } = require('./utility');
const moment = require('moment');

const serviceKey = path.resolve(process.env.NODE_PATH, './duroonto.json');

const fileFilter = (req, file, cb) => {
	// Reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const multerMiddleware = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter,
});





const bucket = '';
const uploadImage = (req, res) =>
	new Promise((resolve, reject) => {
		let nameWithoutExt = path.parse(req.file.originalname).name;
		const extension = path.extname(req.file.originalname);
		let newFilename = `${nameWithoutExt}-${
			process.env.WEBSITE_NAME
		}-${moment().format('DDMMYYHmmss')}-${Math.floor(Math.random() * 100)}`;
		newFilename = makeSlug(newFilename) + extension;

		const blob = bucket.file(newFilename);
		const blobStream = blob.createWriteStream({
			resumable: false,
		});

		blobStream.on('error', () => {
			reject(`Unable to upload image, something went wrong`);
		});
		blobStream.on('finish', async () => {
			const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

			try {
				await bucket.file(blob.name).makePublic();
				resolve(publicUrl);
			} catch (err) {
				reject(`Unable to upload image, something went wrong for permission.`);
			}
		});
		blobStream.end(req.file.buffer);
	});

const deleteFile = (file) => {
	new Promise(async (resolve, reject) => {
		const fileForDelete = bucket.file(file);
		try {
			let isDeleted = await fileForDelete.delete();
			resolve(isDeleted);
		} catch (err) {
			reject(err.message);
		}
	});
};

module.exports = { multerMiddleware, uploadImage, deleteFile };
