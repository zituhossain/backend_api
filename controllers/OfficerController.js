const apiResponse = require('../helpers/apiResponse');
const { Officer, sequelize } = require('../models');
const { updateAllPlacesWithOfficerData } = require('./ReportController.js');
const CryptoJS = require('crypto-js');

const fs = require('fs');
const path = require('path');
const base_dir_config = require('../config.js');

exports.createofficer = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/officer/${req.file.filename}`;
		req.body.image = filePath;
	}
	try {
		if (req.body.name) {
			const officer_data = await Officer.findOne({
				where: { name: req.body.name },
			});
			if (officer_data) {
				return apiResponse.ErrorResponse(
					res,
					'NGO officer already found in database'
				);
			} else {
				req.body.status = 'active';
				// await Officer.create(req.body)
				await Officer.create({
					name: req.body.name.trim(),
					father_name: req.body.father_name,
					email: req.body.email,
					date_of_birth: req.body.date_of_birth,
					phone: req.body.phone,
					phone2: req.body.phone2,
					address: req.body.address,
					nid: req.body.nid,
					nid: req.body.nid,
					educational_qualification: req.body.educational_qualification,
					financial_activities: req.body.financial_activities,
					gender: req.body.gender,
					status: req.body.status,
				});
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'name/address/phone/email missing');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.filterImageName = async (req, res) => {
	console.log('---------------------filterImageName--------------');
	try {
		const data = await Officer.findAll();
		const specialCharacterRegex = /[^\w\s\u0980-\u09FF/]/g; // Regex to match special characters except "/"

		for (let i = 0; i < data?.length; i++) {
			const field = data[i]?.image;
			console.log(data[i]?.image);

			if (field && (field.includes(' ') || specialCharacterRegex.test(field))) {
				let updatedField = field.replace(/[\s\u200B-\u200D\uFEFF]/g, '_');

				const fileExtensionRegex = /\.[^.]+$/; // Regex to match file extension
				const fileNameWithoutExtension = updatedField.replace(
					fileExtensionRegex,
					''
				);
				const fileExtension = field.match(fileExtensionRegex)[0];

				const updatedFileName =
					fileNameWithoutExtension
						.replace(specialCharacterRegex, '')
						.replace(/\s/g, '_') + fileExtension;

				console.log('filter====>', updatedFileName);

				await Officer.update(
					{ image: updatedFileName },
					{ where: { id: data[i].id } }
				);
			}
		}

		return res
			.status(200)
			.json({ message: 'Field data filtered successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

exports.filterLocalDirectoryImageName = async (req, res) => {
	try {
		const directoryPath = base_dir_config.base_dir + 'uploads/officer/';
		console.log('I am here');

		fs.readdir(directoryPath, async (err, files) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: 'Internal server error' });
			}

			const fileExtensionRegex = /\.[^.]+$/; // Regex to match file extension
			const specialCharacterRegex = /[^\w\s\u0980-\u09FF]/g; // Regex to match special characters

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const filePath = path.join(directoryPath, file);

				if (
					fs.statSync(filePath).isFile() &&
					/\.(jpg|jpeg|png|gif)$/i.test(file)
				) {
					const fileNameWithoutExtension = file.replace(fileExtensionRegex, ''); // Remove file extension from file name
					const fileExtension = file.match(fileExtensionRegex)[0]; // Get file extension

					const updatedFileName =
						fileNameWithoutExtension
							.replace(specialCharacterRegex, '')
							.replace(/\s/g, '_') + fileExtension;
					const updatedFilePath = path.join(directoryPath, updatedFileName);

					fs.renameSync(filePath, updatedFilePath);
				}
			}

			return res
				.status(200)
				.json({ message: 'Image files filtered successfully' });
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

exports.getallofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll();
		if (officer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Officer table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getOfficerInfoById = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			`select * from ngo_place_info where officer_id = '${req.params.condition}' and place_id =${req.params.id} ORDER BY year DESC`
		);
		// const [results, metadata] = await sequelize.query(
		// 	`select * from ngo_place_info where officer_id = '${req.params.officer_id}' and place_id =${req.params.place_id} ORDER BY year DESC`
		// );
		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Officer table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getOfficerHistory = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			`SELECT years.bn_name,years.bn_term,ngos.name as ngo_name,ngos.logo_name,places.name as place_name,year_place_ngo_officers.rank,served_population,places.id as place_id FROM year_place_ngo_officers left JOIN places on places.id = year_place_ngo_officers.place_id left join years on years.id = year_place_ngo_officers.year_id LEFT join ngos on ngos.id = year_place_ngo_officers.ngo_id WHERE year_place_ngo_officers.officer_id = '${req.params.id}' group by year_id order by years.id desc`
		);
		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Officer table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

var decryptHash = (value) => {
	// return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
	const passphrase = '123';
	const bytes = CryptoJS.AES.decrypt(value, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
};

exports.getOfficerHeadingById = async (req, res) => {
	const officer_id = req.params.condition;
	const place_id = req.params.id;
	// const officer_id = req.params.officer_id;
	// const place_id = req.params.place_id;

	try {
		let [results, metadata] = await sequelize.query(`		
		select GROUP_CONCAT(DISTINCT(heading) order by view_sort) as heading, GROUP_CONCAT(DISTINCT(officers_heading_descriptions.desc)  order by view_sort SEPARATOR '/-/') as descc,profile_types.type,profile_types.id as profile_type_id,officers_heading_descriptions.officer_id from officer_profile_headings LEFT JOIN officers_heading_descriptions on officers_heading_descriptions.heading_id = officer_profile_headings.id LEFT join profile_types on profile_types.id = officer_profile_headings.type LEFT JOIN year_place_ngo_officers on year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.year_id WHERE officers_heading_descriptions.officer_id=${officer_id} and year_place_ngo_officers.place_id = ${place_id} and year_place_ngo_officers.year_id = (select MAX(id) from years) group by profile_types.sort order by profile_types.sort
		`);
		// console.log("111111111111111",results)
		if (results) {
			let final_data = [];
			for (let i = 0; i < results.length; i++) {
				let current_desc = results[i].descc;
				let decoded_desc = '';

				if (current_desc.includes('/-/')) {
					let split_desc = current_desc.split('/-/');
					let new_arr = [];
					for (let v = 0; v < split_desc.length; v++) {
						new_arr.push(decryptHash(split_desc[v]));
					}

					decoded_desc = new_arr.join('/-/');
				} else {
					decoded_desc = decryptHash(current_desc);
				}
				results[i].descc = decoded_desc;
				final_data.push(results[i]);
			}
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				final_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Officer table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			await Officer.update(
				{ status: 'deleted' },
				{ where: { id: officer_id } }
			);
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.activeofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			await Officer.update({ status: 'active' }, { where: { id: officer_id } });
			return apiResponse.successResponse(res, 'Data successfully activated.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateofficerbyid = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/officer/${req.file.filename}`;
		req.body.image = filePath;
	}

	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });

		if (officer_data) {
			if (req.body.name) {
				if (req.body.image === 'null') {
					await Officer.update(
						{
							name: req.body.name.trim(),
							// ... (other fields)
						},
						{ where: { id: officer_id } }
					);
				} else {
					await Officer.update(req.body, { where: { id: officer_id } });
				}

				// Fetch the latest officer data
				// const latestOfficerData = await Officer.findOne({
				// 	where: { id: officer_id },
				// });

				// Trigger the background update
				updateAllPlacesWithOfficerData(officer_id);

				return apiResponse.successResponse(
					res,
					'Data update triggered successfully.'
				);
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name/address/phone/email missing'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getactiveofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll({ where: { status: 'active' } });
		if (officer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No active officer found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getdeletedofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll({
			where: { status: 'deleted' },
		});
		if (officer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No deactive officer found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
