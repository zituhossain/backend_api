const apiResponse = require('../helpers/apiResponse');
const { population_year_place, years, Place, District } = require('../models');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const checkUserRoleByPlace = require('./globalController');
const { createChildJson } = require('./ReportController');

exports.fetchall = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const roleByplace = await checkUserRoleByPlace(token);
		const divisionIds = roleByplace.division;

		let allOverallTitle;
		let arr = [];
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
			allOverallTitle = await population_year_place.findAll({
				include: [years, Place],
				where: { place_id: arr },
			});
		} else {
			allOverallTitle = await population_year_place.findAll({
				include: [years, Place],
			});
		}

		if (allOverallTitle) {
			return apiResponse.successResponseWithData(
				res,
				'population_year_place fetch successfully.',
				allOverallTitle
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
// exports.fetchall = async (req, res) => {
// 	try {
// 		const token = req.headers.authorization.split(' ')[1];
// 		let roleByplace = await checkUserRoleByPlace(token);
// 		let arr = [];
// 		if (
// 			(roleByplace.division.length > 0 &&
// 				roleByplace.district.length > 0 &&
// 				roleByplace.place.length > 0) ||
// 			roleByplace.place.length > 0
// 		) {
// 			arr.push({ place_id: roleByplace.place });
// 		} else if (
// 			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
// 			roleByplace.district.length > 0
// 		) {
// 			const places = await Place.findAll({
// 				attributes: ['id'],
// 				where: {
// 					district_id: roleByplace.district,
// 				},
// 			});

// 			const placeIds = places.map((place) => place.id);
// 			arr.push({ place_id: placeIds });
// 		} else if (roleByplace.division.length > 0) {
// 			const places = await Place.findAll({
// 				attributes: ['id'],
// 				where: {
// 					division_id: roleByplace.division,
// 				},
// 			});

// 			const placeIds = places.map((place) => place.id);
// 			arr.push({ place_id: placeIds });
// 		}

// 		console.log('arr', arr);

// 		const allOverallTitle = await population_year_place.findAll({
// 			include: [years, Place],
// 			where: arr,
// 		});
// 		if (allOverallTitle) {
// 			return apiResponse.successResponseWithData(
// 				res,
// 				'population_year_place fetch successfully.',
// 				allOverallTitle
// 			);
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No data found');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };
exports.getbyCondition = async (req, res) => {
	//console.log('----------dddddd-------------------imhere---------------');
	//console.log(req.body);
	try {
		let query = '';
		if (req.body.place_id) query = `places.id=${req.body.place_id}`;
		else if (req.body.district_id)
			query = `places.district_id =${req.body.district_id}`;
		else if (req.body.division_id)
			query = `places.division_id=${req.body.division_id}`;
		const [results, metadata] = await population_year_place.sequelize.query(
			`
            SELECT 
  SUM(pyp.total_population) AS total_population, 
  SUM(pyp.served_population) AS total_served_population, 
  SUM(pyp.male) AS total_male, 
  SUM(pyp.female) AS total_female, 
  SUM(pyp.minority) AS total_minority, 
  SUM(pyp.minority1) AS total_minority1, 
  SUM(pyp.minority2) AS total_minority2 
FROM 
  population_year_places pyp 
  LEFT JOIN places ON places.id = pyp.place_id 
WHERE 
  ` +
				query +
				`
  AND pyp.year_id = (
    SELECT 
      MAX(id) AS year_id 
    FROM 
      years
  );
`
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

exports.getbyid = async (req, res) => {
	try {
		const title_id = req.params.id;
		const title_data = await population_year_place.findOne({
			where: { id: title_id },
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

exports.getbyYear = async (req, res) => {
	try {
		// const title_id = req.params.year;

		const place = req.params.place;
		const title_data = await population_year_place.findAll({
			where: { place_id: place },
			include: [years],
		});
		// return
		if (title_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				title_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found ashik');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getbyDisId = async (req, res) => {
	try {
		// const title_id = req.params.year;

		const disId = req.params.disId;
		try {
			const [results, metadata] = await population_year_place.sequelize.query(
				'select sum(pyp.minority) as total_minority,sum(pyp.minority1) as total_minority1,sum(pyp.minority2) as total_minority2,sum(pyp.total_population) as total_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female,sum(pyp.minority) as total_minority,sum(pyp.minority1) as total_minority1,sum(pyp.minority2) as total_minority2 from population_year_places pyp left join places on places.id = pyp.place_id where places.district_id = ' +
					disId +
					' and year_id = (select max(id) as year_id from years)'
			);

			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} catch (err) {
			return apiResponse.ErrorResponse(res, err.message);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getbyPlaceId = async (req, res) => {
	try {
		// const title_id = req.params.year;

		const placeId = req.params.placeId;
		try {
			const [results, metadata] = await population_year_place.sequelize.query(
				'select sum(pyp.total_population) as total_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female,sum(pyp.minority) as total_minority,sum(pyp.minority1) as total_minority1,sum(pyp.minority2) as total_minority2 from population_year_places pyp left join places on places.id = pyp.place_id where places.id = ' +
					placeId +
					' and year_id = (select max(id) as year_id from years)'
			);

			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} catch (err) {
			return apiResponse.ErrorResponse(res, err.message);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getMinoritybyPlaceId = async (req, res) => {
	try {
		// const title_id = req.params.year;

		const placeId = req.params.placeId;
		try {
			const [results, metadata] = await population_year_place.sequelize.query(
				'select sum(pyp.minority) as total_minority,sum(pyp.minority1) as total_minority1,sum(pyp.minority2) as total_minority2 from population_year_places pyp left join places on places.id = pyp.place_id where places.id = ' +
					placeId +
					' and year_id = (select max(id) as year_id from years)'
			);

			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} catch (err) {
			return apiResponse.ErrorResponse(res, err.message);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getbyDivId = async (req, res) => {
	try {
		// const title_id = req.params.year;

		const divId = req.params.divId;
		try {
			const [results, metadata] = await population_year_place.sequelize.query(
				'select sum(pyp.total_population) as total_population, sum(pyp.minority) as total_minority, sum(pyp.minority1) as total_minority1, sum(pyp.minority2) as total_minority2,sum(pyp.male) as total_male,sum(pyp.female) as total_female,sum(pyp.minority) as total_minority,sum(pyp.minority1) as total_minority1,sum(pyp.minority2) as total_minority2 from population_year_places pyp left join places on places.id = pyp.place_id where division_id = ' +
					divId +
					' and year_id = (select max(id) as year_id from years)'
			);

			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} catch (err) {
			return apiResponse.ErrorResponse(res, err.message);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.create = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.created_by = userId;
		console.log('req.body', req.body);
		const get_data = await population_year_place.findOne({
			where: {
				place_id: req.body.place_id,
				year_id: req.body.year_id,
				event_type: req.body.event_type,
			},
		});
		// console.log("get_data", get_data)
		// return
		// if (Object.keys(req.body).length === 0) {
		// 	return apiResponse.ErrorResponse(res, 'description missing');
		// } else {
		// 	await population_year_place.create(req.body);
		// 	return apiResponse.successResponse(
		// 		res,
		// 		'population_year_place saved successfully.'
		// 	);
		// }
		if (!get_data) {
			if (Object.keys(req.body).length === 0) {
				return apiResponse.ErrorResponse(res, 'description missing');
			} else {
				await population_year_place.create(req.body);

				const childJson = await createChildJson(req.body.place_id, "populationByPlace")
				if (childJson === true) {
					return apiResponse.successResponse(res, 'Data successfully updated.');
				} else {
					return apiResponse.successResponse(
						res,
						'Data successfully saved but createChildJson unsuccessful',

					);
				}
			}
		} else {
			return apiResponse.ErrorResponse(
				res,
				'Same Year Same Place Same event Failed'
			);
		}
	} catch (err) {
		console.log(err.message);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updatebyid = async (req, res) => {
	try {
		const condition_id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.updated_by = userId;
		const condition_data = await population_year_place.findOne({
			where: { id: condition_id },
		});


		if (condition_data) {
			if (req.body.place_id) {
				await population_year_place.update(req.body, {
					where: { id: condition_id },
				});

				const childJson = await createChildJson(req.body.place_id, "populationByPlace")
				if (childJson === true) {
					return apiResponse.successResponse(res, 'Data successfully updated.');
				} else {
					return apiResponse.successResponse(
						res,
						'Data successfully saved but createChildJson unsuccessful',

					);
				}
			} else {
				return apiResponse.ErrorResponse(res, 'heading missing');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updatebyid = async (req, res) => {
	try {
		const condition_id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.updated_by = userId;
		const condition_data = await population_year_place.findOne({
			where: { id: condition_id },
		});
		if (condition_data) {
			if (req.body.place_id) {
				await population_year_place.update(req.body, {
					where: { id: condition_id },
				});
				return apiResponse.successResponse(res, 'Data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'heading missing');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.TotalPopulationMinority = async (req, res) => {
	try {
		const [results, metadata] = await population_year_place.sequelize.query(
			`SELECT
            SUM(total_population) AS total_population_sum,
            SUM(minority) AS minority_sum,
            (SUM(minority) / SUM(total_population)) * 100 AS minority_percent
          FROM
            population_year_places
          WHERE
            year_id = (
              SELECT MAX(year_id) FROM population_year_places
            );`
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
