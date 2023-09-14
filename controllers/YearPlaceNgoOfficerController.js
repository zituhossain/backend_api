const apiResponse = require('../helpers/apiResponse');
const {
	years,
	year_place_ngo_officer,
	officers_heading_description,
	Place,
	Officer,
	Ngo,
	sequelize,
	Profile_type,
	officer_profile_heading,
	NgoServed,
	User,
	Setting,
	District
} = require('../models');
const CryptoJS = require('crypto-js');
const checkUserRoleByPlace = require('./globalController');
const UpdatedData = require('../models/mongo_log');
const IP = require('ip');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.deleteYearPlaceNgoofficer = async (req, res) => {
	const row_id = req.params.id;
	const currentOfficer = await year_place_ngo_officer.findOne({
		where: { id: row_id },
	});
	if (currentOfficer) {
		// let check_if_exist = year_place_ngo_officer.findAll({
		// 	where: {
		// 		ngo_id: currentOfficer.ngo_id,
		// 		year_id: currentOfficer.year_id,
		// 	},
		// });
		let check_if_exist_officer = await year_place_ngo_officer.findAll({
			raw: true,
			where: {
				ngo_id: currentOfficer.ngo_id,
				year_id: currentOfficer.year_id,
				place_id: currentOfficer.place_id,
			},
		});
		console.log(
			'check_if_exist_officercheck_if_exist_officer',
			check_if_exist_officer
		);
		// if (check_if_exist_officer.length == 1) {
		// 	await Place.update(
		// 		{
		// 			ngo_id: null,
		// 		},
		// 		{ where: { id: check_if_exist_officer[0].place_id } }
		// 	);
		// }

		// if (check_if_exist.length > 1) {
		// } else if (check_if_exist.length === 1) {
		// 	await NgoServed.destroy({ where: { ngo_id: currentOfficer.ngo_id } });
		// }
		await year_place_ngo_officer.destroy({ where: { id: row_id } });
		// await officers_heading_description.destroy({
		// 	where: { officer_id: currentOfficer.officer_id },
		// });
		return apiResponse.successResponse(res, 'data successfully deleted');
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

/*
exports.fetchYearPlaceNgoofficer = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	let roleByplace = await checkUserRoleByPlace(token);
	let arr = [];
	if (roleByplace.place.length > 0) {
		arr.push({ place_id: roleByplace.place });
	}
	const allOverallTitle = await year_place_ngo_officer.findAll({
		include: [Place, Officer, Ngo, years],
		where: arr,
	});
	if (allOverallTitle) {
		return apiResponse.successResponseWithData(
			res,
			'year_place_ngo_officer fetch successfully.',
			allOverallTitle
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

 */

exports.fetchYearPlaceNgoofficer = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	let roleByplace = await checkUserRoleByPlace(token);
	const divisionIds = roleByplace.division;
	let arr = [];
	let allOverallTitle;
	if (
		roleByplace.division.length > 0 ||
		roleByplace.district.length > 0 ||
		roleByplace.place.length > 0
	) {
		await Promise.all(
			divisionIds.map(async (id) => {
				// Find place id by division id
				const places = await Place.findAll({
					attributes: ['id'],
					where: {
						division_id: id,
					},
				});

				const placeIds = places.map((place) => place.id);
				// Check place id exist in roleByPlace or not
				const matchingPlaceIds = roleByplace.place.filter((id) =>
					placeIds.includes(id)
				);

				// Find district id by division id
				const districts = await District.findAll({
					attributes: ['id'],
					where: {
						division_id: id,
					},
				});

				const districtIds = districts.map((district) => district.id);
				// Check district id exist in roleByPlace or not
				const matchingDistrictIds = roleByplace.district.filter((id) =>
					districtIds.includes(id)
				);

				if (matchingPlaceIds.length > 0) {
					matchingPlaceIds.map((place) => {
						arr.push(place);
					});
				} else if (matchingDistrictIds.length > 0) {
					const places = await Place.findAll({
						attributes: ['id'],
						where: {
							district_id: matchingDistrictIds,
						},
					});

					places.map((place) => {
						arr.push(place.id);
					});
				} else {
					const places = await Place.findAll({
						attributes: ['id'],
						where: {
							division_id: id,
						},
					});

					places.map((place) => {
						arr.push(place.id);
					});
				}
			})
		);
		allOverallTitle = await year_place_ngo_officer.findAll({
			include: [Place, Officer, Ngo, years],
			where: { place_id: arr },
		});
	} else {
		allOverallTitle = await year_place_ngo_officer.findAll({
			include: [Place, Officer, Ngo, years]
		});
	}



	if (allOverallTitle.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'year_place_ngo_officer fetch successfully.',
			allOverallTitle
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.fetchYearPlaceNgoofficerProfileHeadingDetailList = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const allOverallTitle = await Profile_type.findAll({
		include: [officer_profile_heading],
		order: [
			['sort', 'ASC'],
			['id', 'ASC'],
			[{ model: officer_profile_heading }, 'view_sort', 'ASC'],
		],
		required: false,
	});
	if (allOverallTitle) {
		return apiResponse.successResponseWithData(
			res,
			'year_place_ngo_officer fetch successfully.',
			allOverallTitle
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.getYearPlaceNgoofficerbyid = async (req, res) => {
	try {
		const title_id = req.params.id;
		const title_data = await year_place_ngo_officer.findOne({
			where: { id: title_id },
			include: { years },
		});
		if (title_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				title_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
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
exports.getNgoOfficerHeadings = async (req, res) => {
	try {
		const officer_id = req.params.officer_id;
		const year_id = req.params.year_id;
		let [results, metadata] =
			// await sequelize.query(`SELECT officers_heading_descriptions.*,officer_profile_headings.*,year_place_ngo_officers.place_id,division_id,district_id
			//   FROM officers_heading_descriptions
			//   LEFT JOIN officer_profile_headings ON officer_profile_headings.id = officers_heading_descriptions.heading_id
			//   LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.year_id = officers_heading_descriptions.year_id
			//   AND year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id
			//   LEFT JOIN places ON places.id = year_place_ngo_officers.place_id
			//   WHERE year_place_ngo_officers.year_id = ${year_id} AND year_place_ngo_officers.officer_id =${officer_id}
			//   group by officer_profile_headings.id ORDER BY TYPE,view_sort ASC`);

			await sequelize.query(`SELECT 
  officers_heading_descriptions.*, 
  officer_profile_headings.id as heading_id, 
  officer_profile_headings.type as type, 
  officer_profile_headings.heading as heading_name, 
  officer_profile_headings.view_sort as heading_sort, 
  year_place_ngo_officers.place_id, 
  division_id, 
  district_id 
FROM 
  officers_heading_descriptions 
  LEFT JOIN officer_profile_headings ON officer_profile_headings.id = officers_heading_descriptions.heading_id 
  LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.year_id = officers_heading_descriptions.year_id 
  AND year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id 
  LEFT JOIN places ON places.id = year_place_ngo_officers.place_id 
WHERE 
  year_place_ngo_officers.year_id = ${year_id} 
  AND year_place_ngo_officers.officer_id = ${officer_id} 
  AND officers_heading_descriptions.officer_id = ${officer_id} 
  AND officers_heading_descriptions.year_id = ${year_id} 
group by 
  officer_profile_headings.id 
ORDER BY 
  TYPE, 
  view_sort ASC;`);

		if (results) {
			let final_arr = [];
			for (let i = 0; i < results.length; i++) {
				let decrypted_data = decryptHash(results[i].desc);
				results[i].desc = decrypted_data;
				final_arr.push(results[i]);
			}
			console.log('resultsresultsresultsresultsresults', results);
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				final_arr
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getNgoOfficerExists = async (req, res) => {
	try {
		const officer_id = req.params.officer_id;
		const year_id = req.params.year_id;
		const [results, metadata] =
			await sequelize.query(`SELECT officers_heading_descriptions.*
        FROM officers_heading_descriptions
        LEFT JOIN year_place_ngo_officers on officers_heading_descriptions.officer_id = year_place_ngo_officers.officer_id AND officers_heading_descriptions.year_id = year_place_ngo_officers.year_id
        WHERE year_place_ngo_officers.officer_id = ${officer_id} and year_place_ngo_officers.year_id=${year_id}`);
		if (results) {
			let final_arr = [];
			for (let i = 0; i < results.length; i++) {
				let decrypted_data = decryptHash(results[i].desc);
				results[i].desc = decrypted_data;
				final_arr.push(results[i]);
			}
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				final_arr
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getAllCountInformation = async (req, res) => {
	try {
		// const [results, metadata] = await sequelize.query(`select sum(total_population) as total_population,sum(male) as total_male, SUM(female) as total_female,(select count(*) from places) as total_places,(select count(*) from ngos) as total_ngos,(SELECT COUNT(*) from officers) as total_officer,(SELECT COUNT(*) from officers where gender = 1) as male_officer,(SELECT COUNT(*) from officers where gender = 2) as female_officer from population_year_places where year_id = (select id from years order by id DESC LIMIT 1,1)`)
		const [results, metadata] = await sequelize.query(
			`select sum(total_population) as total_population,sum(male) as total_male, SUM(female) as total_female,(select count(*) from places) as total_places,(select count(*) from ngos WHERE type='regular') as total_ngos,(SELECT COUNT(*) from officers where status='active') as total_officer,(SELECT COUNT(*) from officers where gender = 1 and status='active') as male_officer,(SELECT COUNT(*) from officers where gender = 0) as female_officer from population_year_places where year_id = (select MAX(id) from years)`
		);
		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getNgoPopularOfficer = async (req, res) => {
	try {
		console.log('Saku===>', req.params.id);
		//const [results, metadata] = await sequelize.query(`select officers.* from year_place_ngo_officers left join officers on officers.id = year_place_ngo_officers.officer_id where year_place_ngo_officers.year_id =(select id from years order by id DESC LIMIT 1,1) and rank = 1 and year_place_ngo_officers.place_id = ${req.params.id}`)
		//select officers.*, ngos.name as ngoname, year_place_ngo_officers.ngo_id from officers left join year_place_ngo_officers on officers.id = year_place_ngo_officers.officer_id left join ngos on year_place_ngo_officers.ngo_id = ngos.id where year_place_ngo_officers.year_id =(select id from years order by id DESC LIMIT 1,1) and rank = 1 and year_place_ngo_officers.place_id = ${req.params.id}
		//${req.params.id}
		const [results, metadata] = await sequelize.query(
			`SELECT 
  officers.*, 
  ngos.name AS ngoname, 
  year_place_ngo_officers.ngo_id, 
  year_place_ngo_officers.event_type AS ypno_event_type
FROM 
  officers 
  LEFT JOIN year_place_ngo_officers ON officers.id = year_place_ngo_officers.officer_id 
  LEFT JOIN ngos ON year_place_ngo_officers.ngo_id = ngos.id 
WHERE 
year_place_ngo_officers.rank = 1 
  AND year_place_ngo_officers.place_id = ${req.params.id}
  
ORDER BY year_place_ngo_officers.year_id DESC
LIMIT 1;`
		);

		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getNgoFinalOfficer = async (req, res) => {
	try {
		console.log('-----------adsfasfasdfasdf---------------asdfasdfas-df');
		// const [results, metadata] = await sequelize.query(
		// 	`select officers.*, ngos.name as ngoname, year_place_ngo_officers.ngo_id, year_place_ngo_officers.place_id, year_place_ngo_officers.status AS status from officers left join year_place_ngo_officers on officers.id = year_place_ngo_officers.officer_id left join ngos on year_place_ngo_officers.ngo_id = ngos.id LEFT JOIN places ON year_place_ngo_officers.place_id = places.id where year_place_ngo_officers.ngo_id=6 and year_place_ngo_officers.place_id = ${req.params.id} GROUP by year_place_ngo_officers.status;`
		// );
		const [results, metadata] = await sequelize.query(`
			select 
  officers.*, 
  ngos.name as ngoname, 
  year_place_ngo_officers.id as ypno_id,
  year_place_ngo_officers.ngo_id, 
  year_place_ngo_officers.place_id, 
  year_place_ngo_officers.status AS status, 
  years.id as year_id, 
  years.name as year_name
from 
  officers 
  left join year_place_ngo_officers on officers.id = year_place_ngo_officers.officer_id 
  left join ngos on year_place_ngo_officers.ngo_id = ngos.id 
  LEFT JOIN places ON year_place_ngo_officers.place_id = places.id 
  LEFT JOIN years on year_place_ngo_officers.year_id = years.id 
where 
  year_place_ngo_officers.ngo_id = 6 
  and year_place_ngo_officers.place_id = ${req.params.id}
  and years.name = (SELECT MAX(name) FROM years)
  and year_place_ngo_officers.year_id = years.id;`);
		console.log(results);
		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getYearPlaceNgoOfficebyPlace = async (req, res) => {
	try {
		const placeid = req.params.placeid;
		const title_data = await year_place_ngo_officer.findOne({
			where: { place_id: placeid },
			include: [years],
		});
		if (title_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				title_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getYearPlaceNgoOfficebyYear = async (req, res) => {
	try {
		const placeid = req.params.year;
		const id = req.params.id;
		console.log('id', id);
		const title_data = await year_place_ngo_officer.findOne({
			include: [Officer, Ngo, years],
			where: { year_id: placeid, ngo_id: id },
		});
		if (title_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				title_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
var generateHash = (value) => {
	// return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
	const passphrase = '123';
	return CryptoJS.AES.encrypt(value, passphrase).toString();
};

exports.createYearPlaceNgoofficer = async (req, res) => {
	try {
		// const jot_data = await Ngo.findOne({
		// 	where: {
		// 		id: req.body.ngo_id,
		// 	},
		// });

		const eventTypeData = await year_place_ngo_officer.findOne({
			where: {
				place_id: req.body.place_id,
				year_id: req.body.year_id,
				event_type: req.body.event_type,
				ngo_id: req.body.ngo_id,
			},
		});

		const status_data = await year_place_ngo_officer.findOne({
			where: {
				place_id: req.body.place_id,
				year_id: req.body.year_id,
				status: req.body.status,
				ngo_id: req.body.ngo_id,
			},
		});
		const rank_data = await year_place_ngo_officer.findOne({
			where: {
				place_id: req.body.place_id,
				year_id: req.body.year_id,
				rank: req.body.rank,
			},
		});

		// console.log(
		// 	'------------------createYearPlaceNgoofficer----------------',
		// 	rank_data
		// );
		if (
			!status_data ||
			req.body.status !== 1 ||
			(status_data.status !== 1 && req.body.status === 1) ||
			req.body.event_type === 1 ||
			eventTypeData?.event_type !== req.body?.event_type
		) {
			if (
				!rank_data ||
				rank_data.rank !== req.body.rank ||
				req.body.rank === 0 ||
				req.body.rank === null ||
				req.body.event_type === 1 ||
				eventTypeData?.event_type !== req.body?.event_type
			) {
				const get_data = await year_place_ngo_officer.findOne({
					where: {
						place_id: req.body.place_id,
						year_id: req.body.year_id,
						ngo_id: req.body.ngo_id,
						officer_id: req.body.officer_id,
					},
				});

				if (
					!get_data ||
					req.body.event_type === 1 ||
					eventTypeData?.event_type !== req.body?.event_type
				) {
					if (Object.keys(req.body).length === 0) {
						return apiResponse.ErrorResponse(res, 'placeID missing');
					} else {
						const ypno = await year_place_ngo_officer.create(req.body);
						const headingsList = req.body.headingsList;
						const headingsValueList = req.body.headingsValueList;
						const [results, metadata] =
							await sequelize.query(`SELECT officers_heading_descriptions.*
            FROM officers_heading_descriptions LEFT JOIN year_place_ngo_officers on officers_heading_descriptions.officer_id = year_place_ngo_officers.officer_id AND officers_heading_descriptions.year_id = year_place_ngo_officers.year_id  WHERE year_place_ngo_officers.officer_id = ${req.body.officer_id} and year_place_ngo_officers.year_id=${req.body.year_id}`);
						// console.log(results);
						if (results.length === 0) {
							headingsValueList.length > 0 &&
								headingsValueList.map(async (res, index) => {
									if (res?.headings_value && res?.headings_value !== '') {
										let hashedContent = generateHash(res?.headings_value ?? '');

										const description = {
											id: res.id,
											officer_id: req.body.officer_id,
											year_id: req.body.year_id,
											heading_id: res.heading_id,
											desc: hashedContent,
										};
										if (res.id === null) {
											console.log('---------------new addition----------');
											//console.log(description)
											await officers_heading_description.create(description);
										}
									}
								});
						}
						// console.log('ypno', ypno)
						return apiResponse.successResponse(
							res,
							'Year Place Ngo Officer saved successfully.'
						);
					}
				} else {
					return apiResponse.ErrorResponse(
						res,
						'Same Year Same Place Same NGO Same Officer Failed'
					);
				}
			} else {
				return apiResponse.ErrorResponse(
					res,
					'একই স্থানে, একই বছরে দুইজনের রেজাল্ট/ রেঙ্ক সমান হতে পারবে না'
				);
			}
		} else {
			return apiResponse.ErrorResponse(
				res,
				'একই স্থানে, একই বছরে দুইজন চূড়ান্ত হতে পারবেন না।'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateoveralltitlebyid = async (req, res) => {
	try {
		const condition_id = req.params.id;
		// For userID:
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;

		const condition_data = await year_place_ngo_officer.findOne({
			where: { id: condition_id },
		});

		if (condition_data) {
			let status_data = [];

			const [results1, metadata1] = await sequelize.query(
				`SELECT * FROM year_place_ngo_officers WHERE place_id=${req.body.place_id} AND year_id=${req.body.year_id} AND status=${req.body.status} AND ngo_id=${req.body.ngo_id} AND id <> ${condition_id} LIMIT 1;`
			);
			if (results1.length > 0) {
				status_data = results1[0];
			} else {
				status_data['status'] = 0;
			}

			let rank_data = [];
			const [results, metadata] = await sequelize.query(
				`SELECT * FROM year_place_ngo_officers WHERE place_id=${req.body.place_id} AND year_id=${req.body.year_id} AND rank=${req.body.rank} AND event_type=0 AND id <> ${condition_id} LIMIT 1;`
			);
			if (results.length > 0) {
				rank_data = results[0];
			} else {
				rank_data['rank'] = 0;
			}

			if (
				!status_data ||
				req.body.status !== 1 ||
				(status_data.status !== 1 && req.body.status === 1) ||
				req.body.event_type === 1
			) {
				if (
					!rank_data ||
					rank_data.rank !== req.body.rank ||
					req.body.rank === 0 ||
					req.body.rank === null ||
					req.body.event_type === 1
				) {
					if (req.body.place_id) {
						// Fetch the old year_place_ngo_officer record
						const oldInstance = await year_place_ngo_officer.findOne({
							where: { id: condition_id },
						});

						// year_place_ngo_officer old value
						const oldYearPlaceNgoofficer = { ...oldInstance.dataValues };
						oldInstance.set(req.body); // Update the old instance with new values
						await oldInstance.save(); // Save the updated old instance

						// Fetch the updated year_place_ngo_officer record
						const updatedInstance = await year_place_ngo_officer.findOne({
							where: { id: condition_id },
						});

						// year_place_ngo_officer new value
						const updatedYearPlaceNgoofficer = {
							...updatedInstance.dataValues,
						};

						// officers_heading_description old value
						const oldOfficersHeadingDescription =
							await officers_heading_description.findAll({
								attributes: ['id', 'heading_id', 'desc'],
								where: {
									officer_id: req.body.officer_id,
									year_id: oldYearPlaceNgoofficer.year_id,
								},
							});
						const oldOfficersHeadingDescriptionData =
							oldOfficersHeadingDescription.map((item) => ({
								...item.dataValues,
							})); // End

						const headingsList = req.body.headingsList;
						const headingsValueList = req.body.headingsValueList;

						headingsValueList.length > 0 &&
							headingsValueList.map(async (res, index) => {
								if (res?.headings_value && res?.headings_value !== '') {
									let hashedContent = generateHash(res?.headings_value ?? '');

									const description = {
										id: res.id,
										officer_id: req.body.officer_id,
										year_id: updatedYearPlaceNgoofficer.year_id,
										heading_id: res.heading_id,
										desc: hashedContent,
									};
									if (res.id === null) {
										await officers_heading_description.create(description);
									} else {
										const kafi = await officers_heading_description.update(
											description,
											{
												where: { id: res.id },
											}
										);
									}
								}

								if (
									(res?.id && res?.headings_value === '') ||
									res?.headings_value === null
								) {
									const kafi = await officers_heading_description.destroy({
										where: { id: res.id },
									});
								}
							});

						// Update year_place_ngo_officer
						await year_place_ngo_officer.update(req.body, {
							where: { id: condition_id },
						});

						// officers_heading_description new value
						const newOfficersHeadingDescription =
							await officers_heading_description.findAll({
								attributes: ['id', 'heading_id', 'desc'],
								where: {
									officer_id: req.body.officer_id,
									year_id: updatedYearPlaceNgoofficer.year_id,
								},
							});
						const newOfficersHeadingDescriptionData =
							newOfficersHeadingDescription.map((item) => ({
								...item.dataValues,
							})); // End

						// Updated Data in this Controller Function
						const updatedData = {
							user_id: userId,
							officer_id: req.body.officer_id,
							year_id: updatedYearPlaceNgoofficer.year_id,
							datetime: new Date(),
							ip: req.header('x-forwarded-for') || req.socket.remoteAddress,
							localMachineIP: IP.address(),
							oldValues: {
								year_place_ngo_officer: oldYearPlaceNgoofficer,
								officers_heading_description: oldOfficersHeadingDescriptionData,
							},
							newValues: {
								year_place_ngo_officer: updatedYearPlaceNgoofficer,
								officers_heading_description: newOfficersHeadingDescriptionData,
							},
							tableName: {
								table1: year_place_ngo_officer.getTableName(),
								table2: officers_heading_description.getTableName(),
							},
						};

						const isLoggedPermit = await Setting.findOne({
							where: { name: 'Table Log' },
						});

						// Insert the Data in MongoDB
						const log = new UpdatedData(updatedData);

						if (isLoggedPermit.value === 1) {
							await log.save((err) => {
								if (err) {
									console.error(err);
								} else {
									console.log('Data successfully inserted into MongoDB');
								}
							});
						}
						return apiResponse.successResponse(
							res,
							'Data successfully updated.'
						);
					} else {
						return apiResponse.ErrorResponse(res, 'Description missing');
					}
				} else {
					return apiResponse.ErrorResponse(
						res,
						'একই স্থানে, একই বছরে দুইজনের রেজাল্ট/ রেঙ্ক সমান হতে পারবে না'
					);
				}
			} else {
				return apiResponse.ErrorResponse(
					res,
					'একই স্থানে, একই বছরে দুইজন চূড়ান্ত হতে পারবেন না।'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.updateoveralltitlebyid = async (req, res) => {
// 	try {
// 		const condition_id = req.params.id;
// 		const condition_data = await year_place_ngo_officer.findOne({
// 			where: { id: condition_id },
// 		});

// 		if (condition_data) {
// 			let status_data = [];

// 			const [results1, metadata1] = await sequelize.query(
// 				`SELECT * FROM year_place_ngo_officers WHERE place_id=${req.body.place_id} AND year_id=${req.body.year_id} AND status=${req.body.status} AND ngo_id=${req.body.ngo_id} AND id <> ${condition_id} LIMIT 1;`
// 			);
// 			if (results1.length > 0) {
// 				// console.log('if');
// 				// console.log(results);
// 				status_data = results1[0];
// 			} else {
// 				//console.log('else');
// 				status_data['status'] = 0;
// 			}
// 			let rank_data = [];
// 			const [results, metadata] = await sequelize.query(
// 				`SELECT * FROM year_place_ngo_officers WHERE place_id=${req.body.place_id} AND year_id=${req.body.year_id} AND rank=${req.body.rank} AND event_type=0 AND id <> ${condition_id} LIMIT 1;`
// 			);
// 			if (results.length > 0) {
// 				// console.log('if');
// 				// console.log(results);
// 				rank_data = results[0];
// 			} else {
// 				//console.log('else');
// 				rank_data['rank'] = 0;
// 			}
// 			console.log(status_data);
// 			console.log(
// 				'--------------update--------------bs---',
// 				req.body.status,
// 				'------------sd--',
// 				status_data.status,
// 				'-------',
// 				req.params.id
// 			);
// 			//return;
// 			if (
// 				!status_data ||
// 				req.body.status !== 1 ||
// 				(status_data.status !== 1 && req.body.status === 1) ||
// 				req.body.event_type === 1
// 			) {
// 				if (
// 					!rank_data ||
// 					rank_data.rank !== req.body.rank ||
// 					req.body.rank === 0 ||
// 					req.body.rank === null ||
// 					req.body.event_type === 1
// 				) {
// 					// const get_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, ngo_id: req.body.ngo_id, officer_id: req.body.officer_id } });
// 					// if (!get_data) {
// 					if (req.body.place_id) {
// 						const kafi = await year_place_ngo_officer.update(req.body, {
// 							where: { id: condition_id },
// 						});

// 						// officers_heading_description.destroy({
// 						// 	where: {
// 						// 		officer_id: req.body.officer_id,
// 						// 		year_id: req.body.year_id,
// 						// 	},
// 						// });
// 						const headingsList = req.body.headingsList;

// 						const headingsValueList = req.body.headingsValueList;
// 						//console.log(headingsValueList);
// 						//return("die now");
// 						headingsValueList.length > 0 &&
// 							headingsValueList.map(async (res, index) => {
// 								if (res?.headings_value && res?.headings_value !== '') {
// 									let hashedContent = generateHash(res?.headings_value ?? '');

// 									const description = {
// 										id: res.id,
// 										officer_id: req.body.officer_id,
// 										year_id: req.body.year_id,
// 										heading_id: res.heading_id,
// 										desc: hashedContent,
// 									};
// 									if (res.id === null) {
// 										console.log('---------------new addition----------');
// 										//console.log(description)
// 										await officers_heading_description.create(description);
// 									} else {
// 										console.log('---------------in update----------');
// 										const kafi = await officers_heading_description.update(
// 											description,
// 											{
// 												where: { id: res.id },
// 											}
// 										);
// 										//await officers_heading_description.updat(description);
// 									}
// 								}

// 								if (
// 									(res?.id && res?.headings_value === '') ||
// 									res?.headings_value === null
// 								) {
// 									const kafi = await officers_heading_description.destroy({
// 										where: { id: res.id },
// 									});
// 								}
// 							});

// 						return apiResponse.successResponse(
// 							res,
// 							'Data successfully updated.'
// 						);
// 					} else {
// 						return apiResponse.ErrorResponse(res, 'description missing');
// 					}
// 					// } else {
// 					//     return apiResponse.ErrorResponse(res, "Same Year Same Place Same NGO Same Officer Failed")
// 					// }
// 				} else {
// 					return apiResponse.ErrorResponse(
// 						res,
// 						'একই স্থানে, একই বছরে দুইজনের রেজাল্ট/ রেঙ্ক সমান হতে পারবে না'
// 					);
// 				}
// 			} else {
// 				return apiResponse.ErrorResponse(
// 					res,
// 					'একই স্থানে, একই বছরে দুইজন চূড়ান্ত হতে পারবেন না।'
// 				);
// 			}
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No matching query found');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.getkormibyxid = async (req, res) => {
	try {
		const id = req.params.id;
		const condition_name = req.params.condition;
		let query = '';
		if (condition_name === 'place') {
			query = `places.id`;
		} else if (condition_name === 'division') {
			query = `places.division_id`;
		} else if (condition_name === 'district') {
			query = `places.district_id`;
		}
		const [results, metadata] = await sequelize.query(
			`select places.name,officers.name as officer_name,places.id as place_id,officers.image from places LEFT JOIN year_place_ngo_officers ypno on ypno.place_id = places.id LEFT JOIN officers on officers.id = ypno.officer_id where ${query} = ${id} GROUP BY places.id`
		);
		if (results) {
			console.log('0------------------jjjjj------------------');
			console.log(results);
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// updated query
// SELECT * FROM ngo_place_info2
// where year = (SELECT max(year) FROM ngo_place_info2) and place_id=1
// GROUP BY officer_name ORDER  BY -ngo_jot_id DESC,ypno_view_order,officer_id;
exports.getkormitopbyxid = async (req, res) => {
	try {
		const id = req.params.id;
		const condition_name = req.params.condition;
		let query = '';
		let placeOrderCondition = 'place_id';
		if (condition_name === 'place_id') {
			query = ` place_id=${id}`;
		} else if (condition_name === 'division_id') {
			query = ` division_id=${id}`;
		} else if (condition_name === 'district_id') {
			query = ` district_id=${id}`;
		}
		// query = `where year = (SELECT max(year) FROM ngo_place_info npi) and` + query
		//query = `where year = year(curdate()) and` + query;
		query = `where year = (SELECT max(year) FROM ngo_place_info2) and` + query;

		const [results, metadata] = await sequelize.query(
			`SELECT * FROM ngo_place_info2 ` +
			query +
			` GROUP BY officer_name ORDER BY -` +
			placeOrderCondition +
			` DESC,-ngo_view_order DESC,ypno_status DESC, -ypno_view_order DESC, ypno_view_order,officer_id`
		);

		if (results) {
			let final_arr = [];
			for (let i = 0; i < results.length; i++) {
				console.log('results[i].sarbik_desc', results[i].sarbik_desc);
				if (results[i].sarbik_desc !== null) {
					let decrypted_data = decryptHash(results[i].sarbik_desc);
					results[i].sarbik_desc = decrypted_data;
					final_arr.push(results[i]);
				} else {
					results[i].sarbik_desc = '';
					final_arr.push(results[i]);
				}

				if (results[i]?.sarbik_desc2 !== null) {
					console.log('results[i].sarbik_desc2', results[i].sarbik_desc2);
					let decrypted_data = decryptHash(results[i]?.sarbik_desc2);
					results[i].sarbik_desc2 = decrypted_data;
					console.log('results[i].sarbik_desc2', results[i].sarbik_desc2);
					//final_arr.push(results[i]);
				} else {
					results[i].sarbik_des2 = '';
					//final_arr.push(results[i]);
				}
			}
			//console.log('resultsresultsresultsresultsresults', results);
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				final_arr
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}

		// if (results) {
		//     return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
		// } else {
		//     return apiResponse.ErrorResponse(res, "No matching query found")
		// }
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getYearPlaceNgoOfficersWithConditions = async (req, res) => {
	// how to use
	// const condition = {
	//   place_id: id,
	//   jot_id: 1,
	// };
	// const res = await getYearPlaceNgoOfficersWithConditions(condition);
	try {
		let query = '';

		console.log(req.body);
		if (req.body.place_id) query = ` AND place_id=${req.body.place_id}`;
		else if (req.body.district_id)
			query = ` AND district_id=${req.body.district_id}`;
		else if (req.body.division_id)
			query = ` AND division_id=${req.body.division_id}`;

		if (req.body.jot_id) {
			if (req.body.jot_id === '!1')
				query = query + ` AND (ngo_jot_id <> 1 OR ngo_jot_id IS NULL)`;
			else if (req.body.jot_id === '1')
				query = query + ` AND ngo_jot_id=${req.body.jot_id}`;
			else {
			}
		}
		//console.log(req.body.place_id);
		console.log('--------lddddddd----------------------');
		//where year = (SELECT max(year) FROM ngo_place_info2) AND place_id=250 AND ngo_jot_id <> 1 OR ngo_jot_id IS NULL
		// return;
		// if (condition_name === 'place') {
		// 	query = ` place_id=${id}`;
		// } else if (condition_name === 'division') {
		// 	query = ` division_id=${id}`;
		// } else if (condition_name === 'district') {
		// 	query = ` district_id=${id}`;
		//}
		// query = `where year = (SELECT max(year) FROM ngo_place_info npi) and` + query
		//query = `where year = year(curdate()) and` + query;
		query = `WHERE year = (SELECT max(year) FROM ngo_place_info2)` + query;
		console.log(query);

		const [results, metadata] = await sequelize.query(
			`SELECT *
FROM ngo_place_info2
` +
			query +
			` AND ypno_rank<1 ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id;`
		);

		if (results) {
			let final_arr = [];
			for (let i = 0; i < results.length; i++) {
				if (results[i]?.sarbik_desc !== null) {
					console.log('results[i].sarbik_desc', results[i].sarbik_desc);
					let decrypted_data = decryptHash(results[i]?.sarbik_desc);
					results[i].sarbik_desc = decrypted_data;
					console.log('results[i].sarbik_desc', results[i].sarbik_desc);
					//final_arr.push(results[i]);
				} else {
					results[i].sarbik_desc = '';
					//final_arr.push(results[i]);
				}
				if (results[i]?.sarbik_desc2 !== null) {
					console.log('results[i].sarbik_desc2', results[i].sarbik_desc2);
					let decrypted_data = decryptHash(results[i]?.sarbik_desc2);
					results[i].sarbik_desc2 = decrypted_data;
					console.log('results[i].sarbik_desc2', results[i].sarbik_desc2);
					//final_arr.push(results[i]);
				} else {
					results[i].sarbik_des2 = '';
					//final_arr.push(results[i]);
				}
			}
			//console.log('resultsresultsresultsresultsresults', results);
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}

		// if (results) {
		//     return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
		// } else {
		//     return apiResponse.ErrorResponse(res, "No matching query found")
		// }
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getYearPlaceNgoOfficersWithConditionsForMap = async (req, res) => {
	try {
		let query = '';

		console.log(req.body);
		// if (req.body.place_id) query = ` AND place_id=${req.body.place_id}`;
		// else if (req.body.district_id)
		// 	query = ` AND district_id=${req.body.district_id}`;
		// else if (req.body.division_id)
		// 	query = ` AND division_id=${req.body.division_id}`;

		if (req.body.jot_id) {
			query = query + ` AND ngo_jot_id=${req.body.jot_id}`;
		}
		query = `WHERE year = (SELECT max(year) FROM ngo_place_info2)` + query;
		console.log(query);

		const [results, metadata] = await sequelize.query(
			`SELECT place_id, officer_name, officer_photo, place_name, ypno_status
				FROM ngo_place_info2
	` +
			query +
			` AND ypno_rank<1 ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id;`
		);

		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}

exports.getNgoPoribortitoOfficer = async (req, res) => {
	try {
		const [results, metadata] = await year_place_ngo_officer.sequelize.query(
			`SELECT COUNT(id) AS total_officer
			FROM year_place_ngo_officers
			WHERE status = 3;`
		);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			results
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllUpdatedDataLogMongo = async (req, res) => {
	try {
		const log = await UpdatedData.find({});

		// Find user name
		const userData = await User.findAll({
			attributes: ['id', 'username'],
		});

		// Find officer name
		const officerData = await Officer.findAll({
			attributes: ['id', 'name'],
		});

		// Find year name
		const yearData = await years.findAll({
			attributes: ['id', 'bn_name'],
		});

		// Find Place name
		const placeData = await Place.findAll({
			attributes: ['id', 'name'],
		});

		// Find Ngo name
		const ngoData = await Ngo.findAll({
			attributes: ['id', 'name'],
		});

		// Find Heading name
		const headingData = await officer_profile_heading.findAll({
			attributes: ['id', 'heading'],
		});

		// Combine the data into an object
		const combinedData = log.map((data) => ({
			id: data._id,
			username:
				userData.find((user) => user.id == data.user_id)?.username ?? null,
			officer:
				officerData.find((officer) => officer.id == data.officer_id)?.name ??
				null,
			year: yearData.find((year) => year.id == data.year_id)?.bn_name ?? null,
			ip: data.ip,
			dataTime: data.datetime,
			table: {
				table1: data.tableName.table1,
				table2: data.tableName.table2,
			},
			oldValues: {
				year_place_ngo_officers: {
					place:
						placeData.find(
							(place) =>
								place.id == data.oldValues.year_place_ngo_officer.place_id
						)?.name ?? null,
					year:
						yearData.find((year) => year.id == data.year_id)?.bn_name ?? null,
					ngo:
						ngoData.find(
							(nog) => nog.id == data.oldValues.year_place_ngo_officer.ngo_id
						)?.name ?? null,
					officer:
						officerData.find(
							(officer) =>
								officer.id == data.oldValues.year_place_ngo_officer.officer_id
						)?.name ?? null,
					served_population:
						data.oldValues.year_place_ngo_officer.served_population,
					percent_served: data.oldValues.year_place_ngo_officer.percent_served,
					rank: data.oldValues.year_place_ngo_officer.rank,
					view_order: data.oldValues.year_place_ngo_officer.view_order,
					designation: data.oldValues.year_place_ngo_officer.designation,
					status: data.oldValues.year_place_ngo_officer.status,
					comment: data.oldValues.year_place_ngo_officer.comment,
					comment2: data.oldValues.year_place_ngo_officer.comment2,
					officer_direct_age:
						data.oldValues.year_place_ngo_officer.officer_direct_age,
				},
				officers_heading_description:
					data.oldValues.officers_heading_description.map((item) => ({
						heading:
							headingData.find((heading) => heading.id == item.heading_id)
								?.heading ?? null,
						description: decryptHash(item.desc),
					})),
			},
			newValues: {
				year_place_ngo_officers: {
					place:
						placeData.find(
							(place) =>
								place.id == data.newValues.year_place_ngo_officer.place_id
						)?.name ?? null,
					year:
						yearData.find((year) => year.id == data.year_id)?.bn_name ?? null,
					ngo:
						ngoData.find(
							(nog) => nog.id == data.newValues.year_place_ngo_officer.ngo_id
						)?.name ?? null,
					officer:
						officerData.find(
							(officer) =>
								officer.id == data.newValues.year_place_ngo_officer.officer_id
						)?.name ?? null,
					served_population:
						data.newValues.year_place_ngo_officer.served_population,
					percent_served: data.newValues.year_place_ngo_officer.percent_served,
					rank: data.newValues.year_place_ngo_officer.rank,
					view_order: data.newValues.year_place_ngo_officer.view_order,
					designation: data.newValues.year_place_ngo_officer.designation,
					status: data.newValues.year_place_ngo_officer.status,
					comment: data.newValues.year_place_ngo_officer.comment,
					comment2: data.newValues.year_place_ngo_officer.comment2,
					officer_direct_age:
						data.newValues.year_place_ngo_officer.officer_direct_age,
				},
				officers_heading_description:
					data.newValues.officers_heading_description.map((item) => ({
						heading:
							headingData.find((heading) => heading.id == item.heading_id)
								?.heading ?? null,
						description: decryptHash(item.desc),
					})),
			},
		}));

		// Return the combined data in the API response
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			combinedData
		);
	} catch (e) {
		res.json({ Error: `Error is ${e}` });
	}
};

exports.getUpdatedDataLogMongoByid = async (req, res) => {
	try {
		const log = await UpdatedData.findById(req.params.id);

		console.log('shakhawat', log);

		// Find user name
		const userData = await User.findAll({
			attributes: ['id', 'username'],
		});

		// Find officer name
		const officerData = await Officer.findAll({
			attributes: ['id', 'name'],
		});

		// Find year name
		const yearData = await years.findAll({
			attributes: ['id', 'bn_name'],
		});

		// Find Place name
		const placeData = await Place.findAll({
			attributes: ['id', 'name'],
		});

		// Find Ngo name
		const ngoData = await Ngo.findAll({
			attributes: ['id', 'name'],
		});

		// Find Heading name
		const headingData = await officer_profile_heading.findAll({
			attributes: ['id', 'heading'],
		});

		// Combine the data into an object
		const combinedData = {
			id: log._id,
			username:
				userData.find((user) => user.id == log.user_id)?.username ?? null,
			officer:
				officerData.find((officer) => officer.id == log.officer_id)?.name ??
				null,
			year: yearData.find((year) => year.id == log.year_id)?.bn_name ?? null,
			ip: log.ip,
			dataTime: log.datetime,
			table: {
				table1: log.tableName.table1,
				table2: log.tableName.table2,
			},
			oldValues: {
				year_place_ngo_officers: {
					place:
						placeData.find(
							(place) =>
								place.id == log.oldValues.year_place_ngo_officer.place_id
						)?.name ?? null,
					year:
						yearData.find((year) => year.id == log.year_id)?.bn_name ?? null,
					ngo:
						ngoData.find(
							(nog) => nog.id == log.oldValues.year_place_ngo_officer.ngo_id
						)?.name ?? null,
					officer:
						officerData.find(
							(officer) =>
								officer.id == log.oldValues.year_place_ngo_officer.officer_id
						)?.name ?? null,
					served_population:
						log.oldValues.year_place_ngo_officer.served_population,
					percent_served: log.oldValues.year_place_ngo_officer.percent_served,
					rank: log.oldValues.year_place_ngo_officer.rank,
					view_order: log.oldValues.year_place_ngo_officer.view_order,
					designation: log.oldValues.year_place_ngo_officer.designation,
					status: log.oldValues.year_place_ngo_officer.status,
					comment: log.oldValues.year_place_ngo_officer.comment,
					comment2: log.oldValues.year_place_ngo_officer.comment2,
				},
				officers_heading_description:
					log.oldValues.officers_heading_description.map((item) => ({
						heading:
							headingData.find((heading) => heading.id == item.heading_id)
								?.heading ?? null,
						description: decryptHash(item.desc),
					})),
			},
			newValues: {
				year_place_ngo_officers: {
					place:
						placeData.find(
							(place) =>
								place.id == log.newValues.year_place_ngo_officer.place_id
						)?.name ?? null,
					year:
						yearData.find((year) => year.id == log.year_id)?.bn_name ?? null,
					ngo:
						ngoData.find(
							(nog) => nog.id == log.newValues.year_place_ngo_officer.ngo_id
						)?.name ?? null,
					officer:
						officerData.find(
							(officer) =>
								officer.id == log.newValues.year_place_ngo_officer.officer_id
						)?.name ?? null,
					served_population:
						log.newValues.year_place_ngo_officer.served_population,
					percent_served: log.newValues.year_place_ngo_officer.percent_served,
					rank: log.newValues.year_place_ngo_officer.rank,
					view_order: log.newValues.year_place_ngo_officer.view_order,
					designation: log.newValues.year_place_ngo_officer.designation,
					status: log.newValues.year_place_ngo_officer.status,
					comment: log.oldValues.year_place_ngo_officer.comment,
					comment2: log.oldValues.year_place_ngo_officer.comment2,
				},
				officers_heading_description:
					log.newValues.officers_heading_description.map((item) => ({
						heading:
							headingData.find((heading) => heading.id == item.heading_id)
								?.heading ?? null,
						description: decryptHash(item.desc),
					})),
			},
		};

		// Return the combined data in the API response
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			combinedData
		);
	} catch (e) {
		res.json({ Error: `Error is ${e}` });
	}
};
