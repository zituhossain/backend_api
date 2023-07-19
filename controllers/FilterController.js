const apiResponse = require('../helpers/apiResponse');
const report = require('../helpers/reportLog');
const checkUserRoleByPlace = require('./globalController');
const {
	Division,
	District,
	Place,
	year_place_ngo_officer,
	Ngo,
	years,
	ngo_served_percent_by_palces,
	sequelize,
} = require('../models');
const CryptoJS = require('crypto-js');

exports.divisions = async (req, res) => {
	const divisionsAll = await Division.findAll();
	if (divisionsAll) {
		return apiResponse.successResponseWithData(
			res,
			'all_title fetch successfully.',
			divisionsAll
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
/*
exports.districtById = async (req, res) => {
	const division_id = req.params.id;
	const districtsById = await District.findAll({ where: { division_id } });
	if (districtsById) {
		return apiResponse.successResponseWithData(
			res,
			'all_title fetch successfully.',
			districtsById
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
*/

exports.districtById = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const roleByplace = await checkUserRoleByPlace(token);

		const permittedDistrictIds = roleByplace.district; // Get the permitted district IDs from the user's role
		const permittedDivisionId = roleByplace.division;

		let district_data;

		if (permittedDivisionId.length > 0 && permittedDistrictIds.length > 0) {
			district_data = await District.findAll({
				where: { division_id: permittedDivisionId, id: permittedDistrictIds }, // Fetch districts that match the provided division ID and the permitted district IDs
			});
		} else if (permittedDivisionId.length > 0) {
			district_data = await District.findAll({
				where: { division_id: permittedDivisionId }, // Fetch all districts for the provided division ID when no district IDs are set in the user's role
			});
		} else {
			district_data = await District.findAll({
				where: { division_id: id }, // Fetch all districts for the provided division ID when no district IDs are set in the user's role
			});
		}

		if (district_data && district_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				district_data
			);
		} else {
			return apiResponse.ErrorResponse(
				res,
				'No districts found for the user role and provided division.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.placesByDistricId = async (req, res) => {
	const district_id = req.params.id;
	const placeAll = await Place.findAll({ where: { district_id } });
	if (placeAll) {
		return apiResponse.successResponseWithData(
			res,
			'all_title fetch successfully.',
			placeAll
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
*/

// /*
exports.placesByDistricId = async (req, res) => {
	const district_id = req.params.id;
	const token = req.headers.authorization.split(' ')[1];
	const roleByplace = await checkUserRoleByPlace(token);

	const permittedPlaceIds = roleByplace.place; // Get the permitted place IDs from the user's role

	let placeAll;

	if (permittedPlaceIds.length > 0) {
		placeAll = await Place.findAll({
			where: { district_id, id: permittedPlaceIds }, // Fetch places that match the provided district ID and the permitted place IDs
		});
	} else {
		placeAll = await Place.findAll({ where: { district_id } }); // Fetch all places for the provided district ID when no place IDs are set in the user's role
	}

	if (placeAll && placeAll.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			placeAll
		);
	} else {
		return apiResponse.ErrorResponse(
			res,
			'No places found for the user role and provided district.'
		);
	}
};
// */

exports.places = async (req, res) => {
	const district_id = req.params.id;
	const placeAll = await Place.findAll();
	if (placeAll.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'all_place fetch successfully.',
			placeAll
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

/*
exports.finalReportGenerateCategory = async (req, res) => {
	let query = '';
	if (req.body.year_id !== '') {
		const get_year = await years.findOne({ where: { id: req.body.year_id } });
		if (query.includes('where')) {
			query += ` and year = '${get_year.name}'`;
		} else {
			query += ` where year = '${get_year.name}'`;
		}
	}

	if (req.body.division_id !== '') {
		const get_division = await Division.findOne({
			where: { id: req.body.division_id },
		});
		if (query.includes('where')) {
			query += ` and division_name = '${get_division.name_bg}'`;
		} else {
			query += ` where division_name = '${get_division.name_bg}'`;
		}
	}
	if (req.body.district_id !== '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_name = '${get_district.name_bg}'`;
		} else {
			query += ` where district_name = '${get_district.name_bg}'`;
		}
	}
	if (req.body.place_id !== '') {
		const get_place = await Place.findOne({ where: { id: req.body.place_id } });
		if (query.includes('where')) {
			query += ` and place_name = '${get_place.name}'`;
		} else {
			query += ` where place_name = '${get_place.name}'`;
		}
	}
	let custome_query = '';
	if (req.body.ngo_id === '') {
		custome_query = `,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = 1 and year_place_ngo_officers.status=1 limit 1) as ngo_officer_one`;
	} else {
		custome_query = `,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id} and year_place_ngo_officers.status = 1 limit 1) as ngo_officer_one`;
	}
	if (req.body.ngo_id !== '') {
		const get_ngo = await Ngo.findOne({ where: { id: req.body.ngo_id } });
		if (query.includes('where')) {
			// query += ` and ngo_name = '${get_ngo.name}'`
		} else {
			query += ` where ngo_name = '${get_ngo.name}'`;
		}
		if (req.body.ngo_id2 !== '') {
			const get_ngo2 = await Ngo.findOne({ where: { id: req.body.ngo_id2 } });
			query += ` or ngo_name = '${get_ngo2.name}'`;
		}
	}
	if (
		req.body.category &&
		req.body.category !== '' &&
		req.body.category !== null
	) {
		if (query.includes('where')) {
			query += ` and category_id = '${req.body.category}'`;
		} else {
			query += ` where category_id = '${req.body.category}'`;
		}
	}
	// const [alldata, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info` + query + ` GROUP BY officer_name`);
	console.log('custome_query', custome_query);
	console.log('query', query);
	const [alldata, metadata] = await sequelize.query(
		`SELECT ngo_place_info.*,(select ngo_name from ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name =(select years.name from years order by id DESC LIMIT 1,1) and year_place_ngo_officers.place_id = ngo_place_info.place_id limit 1) as ngo_officer ${custome_query} FROM ngo_place_info` +
			query +
			` GROUP BY place_id`
	);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('ReportCategory', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
*/

exports.finalReportGenerateCategory = async (req, res) => {
	// let query = `SELECT ngo_place_info.*,
	// (SELECT officers.name from year_place_ngo_officers LEFT JOIN officers
	// ON(officers.id = year_place_ngo_officers.officer_id) LEFT JOIN years
	// ON(years.id = year_place_ngo_officers.year_id)
	// WHERE years.name =(SELECT years.name
	// 				   FROM years ORDER BY id DESC LIMIT 1,1) AND year_place_ngo_officers.rank = 1 AND year_place_ngo_officers.place_id = ngo_place_info.place_id LIMIT 1) AS ngo_officer,
	// ngo_place_info.officer_name AS ngo_officer_one
	// FROM ngo_place_info where ngo_place_info.year = (select Max(name) from years) AND ngo_place_info.ypno_status = 1`;
	console.log('-----------------------reportTest----------');
	let currentNgoId;
	if (req.body.ngo_id == '' || req.body.ngo_id == null) currentNgoId = 6;
	else currentNgoId = req.body.ngo_id;
	console.log('currentNgoId ', currentNgoId);
	let mainQuery =
		`
	SELECT 
	npi.place_id AS place_id, 
	npi.place_name AS place_name,
	npi.place_area AS place_area, 
	npi.category_short_name AS category_short_name, 
	npi.place_type_short_name AS place_type_short_name, 
  winner.winner_year_type AS winner_year_type, 
  winner.winner_officer_name AS winner_officer_name, 
  winner.winner_ngo_name AS winner_ngo_name, 
  ngo_officers.ngo_officer_list AS officer_list, 
  nspbp.percent AS ngo_popularity 
FROM ngo_place_info2 AS npi
	LEFT JOIN (
        SELECT 
          npi2.year AS winner_year, 
          npi2.year_type AS winner_year_type, 
          npi2.officer_name AS winner_officer_name, 
          npi2.ngo_name AS winner_ngo_name, 
          npi2.place_id AS winner_place_id,
          npi2.ypno_served_population AS winner_served_population 
        FROM  ngo_place_info2 AS npi2 
  ) AS winner ON npi.place_id = winner.winner_place_id 
      AND winner.winner_year = ( SELECT  MAX(year) FROM  ngo_place_info2  WHERE ypno_rank = 1 
                                AND place_id = winner.winner_place_id ) 
	LEFT JOIN (
        SELECT 
        npi2.place_id AS place_id, 
        npi2.year AS year,
        CONCAT('[',GROUP_CONCAT(
            JSON_OBJECT(
             'officer_name', IFNULL(officer_name, NULL),
             'ngo_name', IFNULL(ngo_name, NULL),
             'officer_photo', IFNULL(officer_photo, NULL),
             'ypno_popularity', IFNULL(ypno_popularity, NULL),
             'ypno_view_order', IFNULL(ypno_view_order, NULL),
             'ypno_status', IFNULL(ypno_status, NULL),
             'event_type', IFNULL(ypno_event_type, NULL)
             ) 
            ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), 
            -ngo_view_order DESC, -ypno_view_order DESC, officer_id 
        ),']') AS ngo_officer_list 
        FROM ngo_place_info2 AS npi2 
        WHERE npi2.year = (SELECT MAX(name) from years WHERE type=0) AND npi2.ngo_id=` +
		currentNgoId +
		`
        GROUP BY npi2.place_id 
    ) AS ngo_officers ON npi.place_id = ngo_officers.place_id 
	LEFT JOIN ngo_served_percent_by_palces AS nspbp on (nspbp.place_id = npi.place_id AND nspbp.ngo_id=` +
		currentNgoId +
		`)`;

	let query = '';
	// if (req.body.ngo_id && req.body.ngo_id !== '' && req.body.ngo_id !== null) {
	// 	if (query.includes('WHERE')) {
	// 		query += ` AND npi2.ngo_id = '${req.body.ngo_id}'`;
	// 	} else {
	// 		query += ` WHERE npi2.ngo_id = '${req.body.ngo_id}'`;
	// 	}
	// }
	// if (req.body.division_id !== '') {
	// 	if (query.includes('WHERE')) {
	// 		query += ` and npi.division_id = '${req.body.division_id}'`;
	// 	} else {
	// 		query += ` WHERE npi.division_id = '${req.body.division_id}'`;
	// 	}
	// }
	// if (req.body.district_id !== '') {
	// 	if (query.includes('WHERE')) {
	// 		query += ` and npi.district_id = '${req.body.district_id}'`;
	// 	} else {
	// 		query += ` WHERE npi.district_id = '${req.body.district_id}'`;
	// 	}
	// }
	if (req.body.place_id !== '') {
		query += ` WHERE npi.place_id = '${req.body.place_id}'`;
	} else if (req.body.district_id !== '') {
		query += ` WHERE npi.district_id = '${req.body.district_id}'`;
	} else if (req.body.division_id !== '') {
		query += ` WHERE npi.division_id = '${req.body.division_id}'`;
	}

	if (
		req.body.category &&
		req.body.category !== '' &&
		req.body.category !== null
	) {
		if (query.includes('WHERE')) {
			query += ` AND npi.category_id = '${req.body.category}'`;
		} else {
			query += ` WHERE npi.category_id = '${req.body.category}'`;
		}
	}

	mainQuery =
		mainQuery +
		query +
		` GROUP BY npi.place_id
ORDER BY npi.place_id`;

	// const [alldata, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info` + query + ` GROUP BY officer_name`);
	//console.log('query', mainQuery);
	const [alldata, metadata] = await sequelize.query(mainQuery);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('success query: ', mainQuery);
		console.log(alldata);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		console.log('faile queyr: ', mainQuery);
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
/*
SELECT
  place.id AS place_id,
  place.name AS place_name,
  IFNULL(
		(SELECT 
		 CONCAT('[',GROUP_CONCAT(JSON_OBJECT(
			 'officer_name', IFNULL(officer_name, NULL),
			 'ngo_name', IFNULL(ngo_name, NULL),
			 'officer_photo', IFNULL(officer_photo, NULL),
			 'event_type', IFNULL(ypno_event_type, NULL)
		 )ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id), ']'
		 )
		 FROM ngo_place_info2
		 WHERE place_id = place.id AND ngo_jot_id=1 and year=2023
		 ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id
		),
		NULL
	) AS jot1Officer,
  CONCAT('[', GROUP_CONCAT(JSON_OBJECT('officer_name', npi.officer_name, 'ngo_name', npi.ngo_name)), ']') AS subplaces
FROM
  places place
LEFT JOIN
  ngo_place_info2 npi ON place.id = npi.place_id
GROUP BY
  place.id, place.name;
*/
exports.reportTest = async (req, res) => {
	// let query = `SELECT ngo_place_info.*,
	// (SELECT officers.name from year_place_ngo_officers LEFT JOIN officers
	// ON(officers.id = year_place_ngo_officers.officer_id) LEFT JOIN years
	// ON(years.id = year_place_ngo_officers.year_id)
	// WHERE years.name =(SELECT years.name
	// 				   FROM years ORDER BY id DESC LIMIT 1,1) AND year_place_ngo_officers.rank = 1 AND year_place_ngo_officers.place_id = ngo_place_info.place_id LIMIT 1) AS ngo_officer,
	// ngo_place_info.officer_name AS ngo_officer_one
	// FROM ngo_place_info where ngo_place_info.year = (select Max(name) from years) AND ngo_place_info.ypno_status = 1`;
	console.log('-----------------------reportTest----------');
	let currentNgoId;
	if (req.body.ngo_id == '' || req.body.ngo_id == null) currentNgoId = 6;
	else currentNgoId = req.body.ngo_id;
	console.log('currentNgoId ', currentNgoId);
	let mainQuery =
		`
	SELECT 
	npi.place_id AS place_id, 
	npi.place_name AS place_name,
	npi.place_area AS place_area, 
	npi.category_short_name AS category_short_name, 
	npi.place_type_short_name AS place_type_short_name, 
  winner.winner_year_type AS winner_year_type, 
  winner.winner_officer_name AS winner_officer_name, 
  winner.winner_ngo_name AS winner_ngo_name, 
  ngo_officers.ngo_officer_list AS officer_list, 
  nspbp.percent AS ngo_popularity 
FROM ngo_place_info2 AS npi
	LEFT JOIN (
        SELECT 
          npi2.year AS winner_year, 
          npi2.year_type AS winner_year_type, 
          npi2.officer_name AS winner_officer_name, 
          npi2.ngo_name AS winner_ngo_name, 
          npi2.place_id AS winner_place_id,
          npi2.ypno_served_population AS winner_served_population 
        FROM  ngo_place_info2 AS npi2 
  ) AS winner ON npi.place_id = winner.winner_place_id 
      AND winner.winner_year = ( SELECT  MAX(year) FROM  ngo_place_info2  WHERE ypno_rank = 1 
                                AND place_id = winner.winner_place_id ) 
	LEFT JOIN (
        SELECT 
        npi2.place_id AS place_id, 
        npi2.year AS year,
        CONCAT('[',GROUP_CONCAT(
            JSON_OBJECT(
             'officer_name', IFNULL(officer_name, NULL),
             'ngo_name', IFNULL(ngo_name, NULL),
             'officer_photo', IFNULL(officer_photo, NULL),
             'ypno_popularity', IFNULL(ypno_popularity, NULL),
             'ypno_view_order', IFNULL(ypno_view_order, NULL),
             'ypno_status', IFNULL(ypno_status, NULL),
             'event_type', IFNULL(ypno_event_type, NULL)
             ) 
            ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), 
            -ngo_view_order DESC, -ypno_view_order DESC, officer_id 
        ),']') AS ngo_officer_list 
        FROM ngo_place_info2 AS npi2 
        WHERE npi2.year = (SELECT MAX(name) from years WHERE type=0) AND npi2.ngo_id=` +
		currentNgoId +
		`
        GROUP BY npi2.place_id 
    ) AS ngo_officers ON npi.place_id = ngo_officers.place_id 
	LEFT JOIN ngo_served_percent_by_palces AS nspbp on (nspbp.place_id = npi.place_id AND nspbp.ngo_id=` +
		currentNgoId +
		`)`;

	let query = '';
	// if (req.body.ngo_id && req.body.ngo_id !== '' && req.body.ngo_id !== null) {
	// 	if (query.includes('WHERE')) {
	// 		query += ` AND npi2.ngo_id = '${req.body.ngo_id}'`;
	// 	} else {
	// 		query += ` WHERE npi2.ngo_id = '${req.body.ngo_id}'`;
	// 	}
	// }
	// if (req.body.division_id !== '') {
	// 	if (query.includes('WHERE')) {
	// 		query += ` and npi.division_id = '${req.body.division_id}'`;
	// 	} else {
	// 		query += ` WHERE npi.division_id = '${req.body.division_id}'`;
	// 	}
	// }
	// if (req.body.district_id !== '') {
	// 	if (query.includes('WHERE')) {
	// 		query += ` and npi.district_id = '${req.body.district_id}'`;
	// 	} else {
	// 		query += ` WHERE npi.district_id = '${req.body.district_id}'`;
	// 	}
	// }
	if (req.body.place_id !== '') {
		query += ` WHERE npi.place_id = '${req.body.place_id}'`;
	} else if (req.body.district_id !== '') {
		query += ` WHERE npi.district_id = '${req.body.district_id}'`;
	} else if (req.body.division_id !== '') {
		query += ` WHERE npi.division_id = '${req.body.division_id}'`;
	}

	if (
		req.body.category &&
		req.body.category !== '' &&
		req.body.category !== null
	) {
		if (query.includes('WHERE')) {
			query += ` AND npi.category_id = '${req.body.category}'`;
		} else {
			query += ` WHERE npi.category_id = '${req.body.category}'`;
		}
	}

	mainQuery =
		mainQuery +
		query +
		` GROUP BY npi.place_id
ORDER BY npi.place_id`;

	// const [alldata, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info` + query + ` GROUP BY officer_name`);
	//console.log('query', mainQuery);
	const [alldata, metadata] = await sequelize.query(mainQuery);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('success query: ', mainQuery);
		console.log(alldata);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		console.log('faile queyr: ', mainQuery);
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateJot = async (req, res) => {
	let query = '';
	if (req.body.year_id !== '') {
		const get_year = await years.findOne({ where: { id: req.body.year_id } });
		if (query.includes('where')) {
			query += ` and year = '${get_year.name}'`;
		} else {
			query += ` where year = '${get_year.name}'`;
		}
	}

	if (req.body.division_id !== '') {
		const get_division = await Division.findOne({
			where: { id: req.body.division_id },
		});
		if (query.includes('where')) {
			query += ` and division_name = '${get_division.name_bg}'`;
		} else {
			query += ` where division_name = '${get_division.name_bg}'`;
		}
	}
	if (req.body.district_id !== '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_name = '${get_district.name_bg}'`;
		} else {
			query += ` where district_name = '${get_district.name_bg}'`;
		}
	}
	if (req.body.place_id !== '') {
		const get_place = await Place.findOne({ where: { id: req.body.place_id } });
		if (query.includes('where')) {
			query += ` and place_name = '${get_place.name}'`;
		} else {
			query += ` where place_name = '${get_place.name}'`;
		}
	}
	let custome_query = '';
	if (req.body.ngo_id === '') {
		custome_query = `,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = 1 and year_place_ngo_officers.status=1 limit 1) as ngo_officer_one`;
	} else {
		custome_query = `,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id} and year_place_ngo_officers.status=1 limit 1) as ngo_officer_one`;
	}
	if (req.body.ngo_id !== '') {
		const get_ngo = await Ngo.findOne({ where: { id: req.body.ngo_id } });
		if (query.includes('where')) {
			// query += ` and ngo_name = '${get_ngo.name}'`
		} else {
			query += ` where ngo_name = '${get_ngo.name}'`;
		}
		if (req.body.ngo_id2 !== '') {
			const get_ngo2 = await Ngo.findOne({ where: { id: req.body.ngo_id2 } });
			query += ` or ngo_name = '${get_ngo2.name}'`;
		}
	}
	if (
		req.body.category &&
		req.body.category !== '' &&
		req.body.category !== null
	) {
		if (query.includes('where')) {
			query += ` and category_id = '${req.body.category}'`;
		} else {
			query += ` where category_id = '${req.body.category}'`;
		}
	}
	// const [alldata, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info` + query + ` GROUP BY officer_name`);
	console.log('custome_query', custome_query);
	const [alldata, metadata] = await sequelize.query(
		`SELECT ngo_place_info.*,(select name from ngo_jots limit 1) jot1,(select ngo_name from ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id where years.name =(
        SELECT
            MAX(NAME)
        FROM
            years
        ) and year_place_ngo_officers.place_id = ngo_place_info.place_id AND ngos.ngo_jots_id = (select id from ngo_jots limit 1) limit 1) as ngo_officer ${custome_query} FROM ngo_place_info` +
		query +
		` GROUP BY place_id`
	);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('ReportJot', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

// exports.finalReportGenerateJotPopularity = async (req, res) => {
// 	let query = '';

// 	if (req.body.division_id !== '') {
// 		query += ` and ngo_jot_add_into_places.division_id = '${req.body.division_id}'`;
// 	}
// 	if (req.body.district_id !== '') {
// 		query += ` and ngo_jot_add_into_places.district_id = '${req.body.district_id}'`;
// 	}
// 	if (req.body.place_id !== '') {
// 		query += ` and ngo_jot_add_into_places.place_id = '${req.body.place_id}'`;
// 	}

// 	const [alldata, metadata] = await sequelize.query(
// 		`SELECT places.id, places.name AS place_name, places.area, SUM(CASE WHEN ngo_jot_id = 1 THEN percent END) AS percent1, SUM(CASE WHEN ngo_jot_id = 2 THEN percent END) AS percent2 FROM ngo_jots jot LEFT JOIN ngo_jot_add_into_places ON (ngo_jot_add_into_places.ngo_jot_id = jot.id) INNER JOIN places ON (ngo_jot_add_into_places.place_id = places.id)` +
// 		query +
// 		`GROUP BY places.id,places.name,places.area`
// 	);

// 	if (alldata.length > 0) {
// 		const userId = report.getUserId(req);
// 		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
// 		console.log('ReportJotPopularity', reportGenerateInfo);

// 		return apiResponse.successResponseWithData(
// 			res,
// 			'all_data fetch successfully.',
// 			alldata
// 		);
// 	} else {
// 		return apiResponse.ErrorResponse(res, 'No data found');
// 	}
// };

exports.finalReportGenerateJotPopularity = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);

		let query = '';

		if (
			roleByplace.division.length > 0 &&
			roleByplace.district.length > 0 &&
			roleByplace.place.length
		) {
			query += ` and places.id in (${roleByplace.place})`;
		}
		if (roleByplace.division.length > 0 && roleByplace.district.length > 0) {
			query += ` and places.district_id in (${roleByplace.district})`;
		}
		if (roleByplace.division.length > 0) {
			query += ` and places.division_id in (${roleByplace.division})`;
		}

		if (req.body.division_id !== '') {
			query += ` and ngo_jot_add_into_places.division_id = '${req.body.division_id}'`;
		}
		if (req.body.district_id !== '') {
			query += ` and ngo_jot_add_into_places.district_id = '${req.body.district_id}'`;
		}
		if (req.body.place_id !== '') {
			query += ` and ngo_jot_add_into_places.place_id = '${req.body.place_id}'`;
		}

		const [alldata, metadata] = await sequelize.query(
			`SELECT places.id, places.name AS place_name, places.area, SUM(CASE WHEN ngo_jot_id = 1 THEN percent END) AS percent1, SUM(CASE WHEN ngo_jot_id = 2 THEN percent END) AS percent2 FROM ngo_jots jot LEFT JOIN ngo_jot_add_into_places ON (ngo_jot_add_into_places.ngo_jot_id = jot.id) INNER JOIN places ON (ngo_jot_add_into_places.place_id = places.id)` +
			query +
			`GROUP BY places.id,places.name,places.area`
		);

		if (alldata.length > 0) {
			const userId = report.getUserId(req);
			const reportGenerateInfo = report.generateReportInfo(
				userId,
				alldata,
				req
			);
			console.log('ReportJotPopularity', reportGenerateInfo);

			return apiResponse.successResponseWithData(
				res,
				'all_data fetch successfully.',
				alldata
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.finalReportGenerateDoubleNGO = async (req, res) => {
	let query = ' where category_short_name IS NOT NULL ';
	if (req.body.year_id != '') {
		const get_year = await years.findOne({ where: { id: req.body.year_id } });
		if (query.includes('where')) {
			query += ` and year = '${get_year.name}'`;
		} else {
			query += ` where year = '${get_year.name}'`;
		}
	}

	if (req.body.division_id != '') {
		const get_division = await Division.findOne({
			where: { id: req.body.division_id },
		});
		if (query.includes('where')) {
			query += ` and division_name = '${get_division.name_bg}'`;
		} else {
			query += ` where division_name = '${get_division.name_bg}'`;
		}
	}
	if (req.body.district_id != '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_name = '${get_district.name_bg}'`;
		} else {
			query += ` where district_name = '${get_district.name_bg}'`;
		}
	}
	if (req.body.place_id != '') {
		const get_place = await Place.findOne({ where: { id: req.body.place_id } });
		if (query.includes('where')) {
			query += ` and place_name = '${get_place.name}'`;
		} else {
			query += ` where place_name = '${get_place.name}'`;
		}
	}
	const [alldata, metadata] = await sequelize.query(
		`SELECT ngo_place_info.*,(select ngo_name from ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select ngo_name from ngo_place_info npi where ngo_id = 2 limit 1) as ngo_name3,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id}) as ngo_officer_one, (select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id2}) as ngo_officer_two,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name =(select years.name from years order by id DESC LIMIT 1,1) and year_place_ngo_officers.place_id = ngo_place_info.place_id limit 1) as ngo_officer FROM ngo_place_info` +
		query +
		` GROUP BY place_id`
	);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('Report2', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
exports.finalReportGeneratePossibilityJot = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);

		let query = '';
		let resYear = await years.findOne({
			where: { id: req.body.year_id },
		});
		let yvalue = resYear.name;
		console.log(yvalue);

		query += yvalue;

		if (
			roleByplace.division.length > 0 &&
			roleByplace.district.length > 0 &&
			roleByplace.place.length
		) {
			query += ` AND place_id IN (${roleByplace.place})`;
		}
		if (roleByplace.division.length > 0 && roleByplace.district.length > 0) {
			query += ` AND district_id IN (${roleByplace.district})`;
		}
		if (roleByplace.division.length > 0) {
			query += ` AND division_id IN (${roleByplace.division})`;
		}

		if (req.body.division_id != '') {
			query += ` AND division_id = '${req.body.division_id}'`;
		}
		if (req.body.district_id != '') {
			query += ` AND district_id = '${req.body.district_id}'`;
		}
		if (req.body.place_id != '') {
			query += ` AND place_id = '${req.body.place_id}'`;
		}

		console.log('-----------------------adfaf----------------------');
		console.log(query);

		const [alldata, metadata] = await sequelize.query(
			`
			SELECT
				subquery.place_id,
				subquery.place_name,
				MAX(subquery.place_area) AS place_area,
				MAX(subquery.category_short_name) AS category_short_name,
				MAX(CASE WHEN subquery.ngo_jot_id = 1 THEN subquery.officer_name END) AS ngo_officer_one,
				MAX(CASE WHEN subquery.ngo_jot_id = 1 THEN subquery.ngo_name END) AS ngo_name1,
				MAX(CASE WHEN subquery.ngo_jot_id != 1 OR subquery.ngo_jot_id IS NULL THEN subquery.officer_name END) AS ngo_officer_two,
				MAX(CASE WHEN subquery.ngo_jot_id != 1 OR subquery.ngo_jot_id IS NULL THEN subquery.ngo_name END) AS ngo_name2,
				(SELECT officer_name
					FROM ngo_place_info2
					WHERE place_id = subquery.place_id AND year <= 2023 AND ypno_rank = 1
					ORDER BY year DESC
					LIMIT 1) AS winner_name,
				(SELECT ngo_name
					FROM ngo_place_info2
					WHERE place_id = subquery.place_id AND year <= 2023 AND ypno_rank = 1
					ORDER BY year DESC
					LIMIT 1) AS winner_ngo_name
			FROM (
				SELECT
					place_id,
					place_name,
					place_area,
					category_short_name,
					officer_name,
					ngo_name,
					ngo_jot_id
				FROM ngo_place_info2
				WHERE ypno_status = 1 AND year = ` +
			query +
			`
				ORDER BY place_id, ngo_jot_id
			) subquery
			GROUP BY subquery.place_id, subquery.place_name
			ORDER BY subquery.place_id;
		`
		);

		if (alldata.length > 0) {
			const userId = report.getUserId(req);
			const reportGenerateInfo = report.generateReportInfo(
				userId,
				alldata,
				req
			);
			//console.log('ReportPossibilityJot', reportGenerateInfo);
			return apiResponse.successResponseWithData(
				res,
				'all_data fetch successfully.',
				alldata
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.finalReportGeneratePossibilityJot = async (req, res) => {
// 	console.log(req.body);
// 	let query = '';
// 	let resYear = await years.findOne({
// 		where: { id: req.body.year_id },
// 	});
// 	let yvalue = resYear.name;
// 	console.log(yvalue);
// 	//return ('die');

// 	query += yvalue;
// 	if (req.body.division_id != '') {
// 		query += ` AND division_id = '${req.body.division_id}'`;
// 	}
// 	if (req.body.district_id != '') {
// 		query += ` AND district_id = '${req.body.district_id}'`;
// 	}
// 	if (req.body.place_id != '') {
// 		query += ` AND place_id = '${req.body.place_id}'`;
// 	}
// 	console.log('-----------------------adfaf----------------------');
// 	console.log(query);
// 	const [alldata, metadata] = await sequelize.query(
// 		`
// 	SELECT
//     subquery.place_id,
//     subquery.place_name,
//     MAX(subquery.place_area) AS place_area,
//     MAX(subquery.category_short_name) AS category_short_name,
//     MAX(CASE WHEN subquery.ngo_jot_id = 1 THEN subquery.officer_name END) AS ngo_officer_one,
//     MAX(CASE WHEN subquery.ngo_jot_id = 1 THEN subquery.ngo_name END) AS ngo_name1,
//     MAX(CASE WHEN subquery.ngo_jot_id != 1 OR subquery.ngo_jot_id IS NULL THEN subquery.officer_name END) AS ngo_officer_two,
//     MAX(CASE WHEN subquery.ngo_jot_id != 1 OR subquery.ngo_jot_id IS NULL THEN subquery.ngo_name END) AS ngo_name2,
//     (SELECT officer_name
//      FROM ngo_place_info2
//      WHERE place_id = subquery.place_id AND year <= 2023 AND ypno_rank = 1
//      ORDER BY year DESC
//      LIMIT 1) AS winner_name,
//     (SELECT ngo_name
//      FROM ngo_place_info2
//      WHERE place_id = subquery.place_id AND year <= 2023 AND ypno_rank = 1
//      ORDER BY year DESC
//      LIMIT 1) AS winner_ngo_name
// FROM (
//     SELECT
//         place_id,
//         place_name,
//         place_area,
//         category_short_name,
//         officer_name,
//         ngo_name,
//         ngo_jot_id
//     FROM ngo_place_info2
//     WHERE ypno_status = 1 AND year = ` +
// 		query +
// 		`
//     ORDER BY place_id, ngo_jot_id
// ) subquery
// GROUP BY subquery.place_id, subquery.place_name
// ORDER BY subquery.place_id;`
// 	);

// 	if (alldata.length > 0) {
// 		const userId = report.getUserId(req);
// 		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
// 		//console.log('ReportPossibilityJot', reportGenerateInfo);
// 		return apiResponse.successResponseWithData(
// 			res,
// 			'all_data fetch successfully.',
// 			alldata
// 		);
// 	} else {
// 		return apiResponse.ErrorResponse(res, 'No data found');
// 	}
// };

exports.finalReportGeneratePossibilityJot3 = async (req, res) => {
	let query = ' where category_short_name IS NOT NULL ';
	console.log('req ', req.body);
	if (req.body.year_id != '') {
		const get_year = await years.findOne({ where: { id: req.body.year_id } });
		if (query.includes('where')) {
			query += ` and year = '${get_year.name}'`;
		} else {
			query += ` where year = '${get_year.name}'`;
		}
	}

	if (req.body.division_id != '') {
		const get_division = await Division.findOne({
			where: { id: req.body.division_id },
		});
		if (query.includes('where')) {
			query += ` and division_name = '${get_division.name_bg}'`;
		} else {
			query += ` where division_name = '${get_division.name_bg}'`;
		}
	}
	if (req.body.district_id != '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_name = '${get_district.name_bg}'`;
		} else {
			query += ` where district_name = '${get_district.name_bg}'`;
		}
	}
	if (req.body.place_id != '') {
		const get_place = await Place.findOne({ where: { id: req.body.place_id } });
		if (query.includes('where')) {
			query += ` and place_name = '${get_place.name}'`;
		} else {
			query += ` where place_name = '${get_place.name}'`;
		}
	}
	console.log('------------------------');
	console.log(query);
	const [alldata, metadata] = await sequelize.query(`SELECT
    ngo_place_info.*,(select name from ngo_jots limit 1) jot1,(select name from ngo_jots limit 1,1) jot2,
    (
    SELECT
        ngo_name
    FROM
        ngo_place_info npi
    WHERE
        ngo_id = 1
    LIMIT 1
) AS ngo_name2,(
    SELECT
        ngo_name
    FROM
        ngo_place_info npi
    WHERE
        ngo_id = 2
    LIMIT 1
) AS ngo_name3,(
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    LEFT JOIN years ON years.id = year_place_ngo_officers.year_id
    LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id
    WHERE
        years.name =(
    SELECT
        MAX(NAME)
    FROM
        years
    ) AND year_place_ngo_officers.place_id = ngo_place_info.place_id AND ngos.ngo_jots_id = (select id from ngo_jots limit 1) limit 1
) AS ngo_officer_one,
(
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    LEFT JOIN years ON years.id = year_place_ngo_officers.year_id
    LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id
    WHERE
        years.name =(
    SELECT
        MAX(NAME)
    FROM
        years
    ) AND year_place_ngo_officers.place_id = ngo_place_info.place_id AND ngos.ngo_jots_id = (select id from ngo_jots limit 1,1) limit 1
) AS ngo_officer_two,
(
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    LEFT JOIN years ON years.id = year_place_ngo_officers.year_id
    WHERE
        years.name =(
        SELECT
            years.name
        FROM
            years
        ORDER BY
            id
        DESC
    LIMIT 1,
    1
    ) AND year_place_ngo_officers.place_id = ngo_place_info.place_id
LIMIT 1
) AS ngo_officer
FROM
    ngo_place_info ${query}
GROUP BY
    place_id`);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		//console.log('ReportPossibilityJot', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
exports.masterReport = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);

		let query = '';
		let resYear = await years.findOne({
			where: { id: req.body.year_id },
		});
		let yvalue = resYear.name;
		console.log(yvalue);

		//query += yvalue;

		if (
			roleByplace.division.length > 0 &&
			roleByplace.district.length > 0 &&
			roleByplace.place.length
		) {
			query += ` WHERE places.id IN (${roleByplace.place})`;
		}
		else if (roleByplace.division.length > 0 && roleByplace.district.length > 0) {
			query += ` WHERE places.district_id IN (${roleByplace.district})`;
		}
		else if (roleByplace.division.length > 0) {
			query += ` WHERE places.division_id IN (${roleByplace.division})`;
		} else {

			if (req.body.division_id != '') {
				query += ` WHERE places.division_id = ${req.body.division_id}`;
			}
			if (req.body.district_id != '') {
				query = ` WHERE places.district_id = ${req.body.district_id}`;
			}
			if (req.body.place_id != '') {
				query = ` WHERE places.id = ${req.body.place_id}`;
			}
		}

		console.log('-----------------------adfaf----------------------');
		console.log(query);

		const [alldata, metadata] = await sequelize.query(
			`
			SELECT 
  places.id AS place_id, 
  places.name as place_name, 
  places.area as place_area, 
  IFNULL(ngo_categories.short_name, NULL) AS category_short_name, 
  IFNULL(ngo_categories.name, NULL) AS category_name, 
  IFNULL(ngo_categories.color_code, NULL) AS category_color, 
  IFNULL(place_type.short_name, NULL) AS place_type_short_name, 
  IFNULL(place_type.name, NULL) AS place_type_name, 
  IFNULL(place_type.color_code, NULL) AS place_type_color, 
  IFNULL(
    (
      SELECT 
      	CAST(
	        JSON_OBJECT(
	          'officer_name', 
	          IFNULL(officer_name, NULL), 
	          'officer_photo', 
	          IFNULL(officer_photo, NULL), 
	          'ngo_name', 
	          IFNULL(ngo_name, NULL), 
	          'event_type', 
	          IFNULL(ypno_event_type, NULL)
	        ) AS CHAR
        )
      FROM 
        ngo_place_info2 
      WHERE 
        place_id = places.id 
        AND ypno_rank = 1 
      ORDER BY 
        year DESC 
      LIMIT 
        1
    ), NULL
  ) AS winnerInfo, 
  IFNULL(
    (
      SELECT 
      	CAST(
	        JSON_OBJECT(
	          'officer_id', 
	          IFNULL(npi2.officer_id, NULL), 
	          'officer_place_id', 
	          IFNULL(npi2.place_id, NULL), 
	          'officer_name', 
	          IFNULL(npi2.officer_name, NULL), 
	          'officer_photo', 
	          IFNULL(npi2.officer_photo, NULL), 
	          'officer_popularity', 
	          IFNULL(npi2.ypno_popularity, NULL), 
	          'officer_comment', 
	          IFNULL(npi2.ypno_comment, NULL), 
	          'officer_age_year', 
	          IFNULL(npi2.officer_age_year, NULL), 
			  		'ypno_officer_direct_age', 
	          IFNULL(npi2.ypno_officer_direct_age, NULL),
	          'ngo_name', 
	          IFNULL(npi2.ngo_name, NULL), 
	          'ngo_popularity', 
	          IFNULL(nspbp.percent, NULL), 
	          'or_officer_id', 
	          IFNULL(npi3.officer_id, NULL), 
	          'or_officer_place_id', 
	          IFNULL(npi3.place_id, NULL), 
	          'or_officer_name', 
	          IFNULL(npi3.officer_name, NULL), 
	          'or_officer_photo', 
	          IFNULL(npi3.officer_photo, NULL), 
	          'or_officer_popularity', 
	          IFNULL(npi3.ypno_popularity, NULL), 
	          'or_officer_comment', 
	          IFNULL(npi3.ypno_comment, NULL), 
	          'or_officer_age_year', 
	          IFNULL(npi3.officer_age_year, NULL), 
			  		'or_ypno_officer_direct_age', 
	          IFNULL(npi3.ypno_officer_direct_age, NULL), 
	          'or_ngo_name', 
	          IFNULL(npi3.ngo_name, NULL), 
	          'or_ngo_popularity', 
	          IFNULL(nspbp3.percent, NULL)
	        )  AS CHAR 
        )
      FROM 
        ngo_place_info2 AS npi2 
        LEFT JOIN ngo_place_info2 AS npi3 on npi2.ypno_view_order = npi3.ypno_view_order 
        AND npi2.ypno_view_order IS NOT NULL 
        AND npi2.year = npi3.year 
        AND npi2.ypno_id != npi3.ypno_id 
        AND npi2.place_id = npi3.place_id 
        LEFT JOIN ngo_served_percent_by_palces as nspbp on nspbp.ngo_id = npi2.ngo_id 
        AND nspbp.place_id = npi2.place_id
        LEFT JOIN ngo_served_percent_by_palces as nspbp3 on nspbp3.ngo_id = npi3.ngo_id 
        AND nspbp3.place_id = npi3.place_id 
      WHERE 
        npi2.place_id = places.id 
        AND npi2.ngo_jot_id = 1 
        AND npi2.ypno_status = 1 
        AND npi2.year = 2023 
      ORDER BY 
        npi2.year DESC 
      LIMIT 
        1
    ), NULL
  ) AS jot1_officer, 
  IFNULL(
    (
      SELECT 
        SUM(percent) 
      FROM 
        ngo_served_percent_by_palces as nspbp 
        LEFT JOIN ngos on ngos.id = ngo_id 
      WHERE 
        ngos.ngo_jots_id = 1 
        AND places.id = nspbp.place_id 
      LIMIT 
        1
    ), NULL
  ) AS popularity_jot1, 
  IFNULL(
    (
      SELECT 
      	CAST(
	        JSON_OBJECT(
	          'officer_id', 
	          IFNULL(npi2.officer_id, NULL), 
	          'officer_place_id', 
	          IFNULL(npi2.place_id, NULL), 
	          'officer_name', 
	          IFNULL(npi2.officer_name, NULL), 
	          'officer_photo', 
	          IFNULL(npi2.officer_photo, NULL), 
	          'officer_popularity', 
	          IFNULL(npi2.ypno_popularity, NULL), 
	          'officer_comment', 
	          IFNULL(npi2.ypno_comment, NULL), 
	          'officer_age_year', 
	          IFNULL(npi2.officer_age_year, NULL), 
			  		'or_ypno_officer_direct_age', 
	          IFNULL(npi2.ypno_officer_direct_age, NULL),
	          'ngo_name', 
	          IFNULL(npi2.ngo_name, NULL), 
	          'ngo_popularity', 
	          IFNULL(nspbp.percent, NULL), 
	          'or_officer_id', 
	          IFNULL(npi3.officer_id, NULL), 
	          'or_officer_place_id', 
	          IFNULL(npi3.place_id, NULL), 
	          'or_officer_name', 
	          IFNULL(npi3.officer_name, NULL), 
	          'or_officer_photo', 
	          IFNULL(npi3.officer_photo, NULL), 
	          'or_officer_popularity', 
	          IFNULL(npi3.ypno_popularity, NULL), 
	          'or_officer_comment', 
	          IFNULL(npi3.ypno_comment, NULL), 
	          'or_ypno_officer_direct_age', 
	          IFNULL(npi3.ypno_officer_direct_age, NULL), 
	          'or_ngo_name', 
	          IFNULL(npi3.ngo_name, NULL), 
	          'or_ngo_popularity', 
	          IFNULL(nspbp3.percent, NULL)
	        ) AS CHAR 
        )
      FROM 
        ngo_place_info2 AS npi2 
        LEFT JOIN ngo_place_info2 AS npi3 on npi2.ypno_view_order = npi3.ypno_view_order 
        AND npi2.ypno_view_order IS NOT NULL 
        AND npi2.year = npi3.year 
        AND npi2.ypno_id != npi3.ypno_id 
        AND npi2.place_id = npi3.place_id 
        LEFT JOIN ngo_served_percent_by_palces as nspbp on nspbp.ngo_id = npi2.ngo_id 
        AND nspbp.place_id = npi2.place_id 
        LEFT JOIN ngo_served_percent_by_palces as nspbp3 on nspbp3.ngo_id = npi3.ngo_id 
        AND nspbp3.place_id = npi3.place_id 
      WHERE 
        npi2.place_id = places.id 
        AND npi2.ngo_jot_id = 1 
        AND npi2.ypno_status = 3 
        AND npi2.year = 2023 
      ORDER BY 
        npi2.year DESC 
      LIMIT 
        1
    ), NULL
  ) AS change_jot1_officer, 
  IFNULL(
    (
      SELECT 
      	CAST(
	        JSON_OBJECT(
	          'officer_id', 
	          IFNULL(npi2.officer_id, NULL), 
	          'officer_place_id', 
	          IFNULL(npi2.place_id, NULL), 
	          'officer_name', 
	          IFNULL(npi2.officer_name, NULL), 
	          'officer_photo', 
	          IFNULL(npi2.officer_photo, NULL), 
	          'officer_popularity', 
	          IFNULL(npi2.ypno_popularity, NULL), 
	          'officer_comment', 
	          IFNULL(npi2.ypno_comment, NULL), 
	          'ngo_name', 
	          IFNULL(npi2.ngo_name, NULL), 
	          'ngo_popularity', 
	          IFNULL(nspbp.percent, NULL)
	        ) AS CHAR 
        )
      FROM 
        ngo_place_info2 AS npi2 
        LEFT JOIN ngo_served_percent_by_palces as nspbp on nspbp.ngo_id = npi2.ngo_id 
        AND nspbp.place_id = npi2.place_id 
      WHERE 
        npi2.place_id = places.id 
        AND npi2.ngo_jot_id = 2 
        AND npi2.ypno_status = 1 
        AND npi2.year = 2023 
      ORDER BY 
        npi2.year DESC 
      LIMIT 
        1
    ), NULL
  ) AS jot2_officer, 
  IFNULL(
    (
      SELECT 
        SUM(percent) 
      FROM 
        ngo_served_percent_by_palces as nspbp 
        LEFT JOIN ngos on ngos.id = ngo_id 
      WHERE 
        ngos.ngo_jots_id = 2 
        AND places.id = nspbp.place_id 
      LIMIT 
        1
    ), NULL
  ) AS popularity_jot2 
FROM 
  places 
  LEFT JOIN ngo_category_bs ON places.id = ngo_category_bs.place_id 
  LEFT JOIN ngo_categories ON ngo_category_bs.ngo_category_id = ngo_categories.id 
  LEFT JOIN ngo_categories AS place_type ON ngo_category_bs.ngo_category_type_id = place_type.id 
  LEFT JOIN ngo_place_info2 AS npi on places.id = npi.place_id ` +
			query +
			`
GROUP BY 
  places.id
		`
		);

		if (alldata.length > 0) {
			const userId = report.getUserId(req);
			const reportGenerateInfo = report.generateReportInfo(
				userId,
				alldata,
				req
			);
			//console.log('ReportPossibilityJot', reportGenerateInfo);
			return apiResponse.successResponseWithData(
				res,
				'all_data fetch successfully.',
				alldata
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
/*
SELECT
  place.id AS place_id,
  place.name AS place_name,
  IFNULL(
		(SELECT 
		 CONCAT('[',GROUP_CONCAT(JSON_OBJECT(
			 'officer_name', IFNULL(officer_name, NULL),
			 'ngo_name', IFNULL(ngo_name, NULL),
			 'officer_photo', IFNULL(officer_photo, NULL),
			 'event_type', IFNULL(ypno_event_type, NULL)
		 )ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id), ']'
		 )
		 FROM ngo_place_info2
		 WHERE place_id = place.id AND ngo_jot_id=1 and year=2023
		 ORDER BY place_id, -ngo_jot_id DESC, FIELD(ypno_status, 1, 3, 2, 0), -ngo_view_order DESC, -ypno_view_order DESC, officer_id
		),
		NULL
	) AS jot1Officer,
  CONCAT('[', GROUP_CONCAT(JSON_OBJECT('officer_name', npi.officer_name, 'ngo_name', npi.ngo_name)), ']') AS subplaces
FROM
  places place
LEFT JOIN
  ngo_place_info2 npi ON place.id = npi.place_id
GROUP BY
  place.id, place.name;
*/
/*
SELECT 
	places.id AS place_id,
	places.name as place_name,
	places.area as place_area,
	IFNULL(ngo_categories.short_name, NULL) AS category_name,
	IFNULL(
		(SELECT officer_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ypno_rank = 1
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS winner_name,
	IFNULL(
		(SELECT ngo_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ypno_rank = 1
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS winner_ngo,
	IFNULL(
		(SELECT officer_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id = 1 AND ypno_status = 1 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS jot1_officer,
	IFNULL(
		(SELECT ngo_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id = 1 AND ypno_status = 1 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS jot1_ngo,
	IFNULL(
		(SELECT percent
		 FROM ngo_served_percent_by_palces as nspbp
		 LEFT JOIN ngo_place_info2 as npi on npi.ngo_id = nspbp.ngo_id 
		 WHERE npi.ngo_jot_id=1 AND npi.ypno_status = 1 AND npi.year=2023 and places.id = nspbp.place_id
		 ORDER BY npi.year DESC
		 LIMIT 1),
		NULL
	) AS popularity_jot1_ngo, 
	IFNULL(
		(SELECT SUM(percent)
		 FROM ngo_served_percent_by_palces as nspbp
		 LEFT JOIN ngos on ngos.id = ngo_id
		 WHERE ngos.ngo_jots_id = 1 AND places.id = nspbp.place_id
		 LIMIT 1),
		NULL
	) AS popularity_jot1,
	IFNULL(
		(SELECT officer_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id = 1 AND ypno_status = 3 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS change_jot1_officer,
	IFNULL(
		(SELECT ngo_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id = 1 AND ypno_status = 3 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS change_jot1_ngo,
	IFNULL(
		(SELECT officer_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id != 1 AND ypno_status = 1 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS jot2_officer,
	IFNULL(
		(SELECT ngo_name
		 FROM ngo_place_info2
		 WHERE place_id = places.id AND ngo_jot_id != 1 AND ypno_status = 1 AND year=2023
		 ORDER BY year DESC
		 LIMIT 1),
		NULL
	) AS jot2_ngo,
	IFNULL(
		(SELECT percent
		 FROM ngo_served_percent_by_palces as nspbp
		 LEFT JOIN ngo_place_info2 as npi on npi.ngo_id = nspbp.ngo_id 
		 WHERE npi.ngo_jot_id=2 AND npi.ypno_status = 1 AND npi.year=2023 and places.id = nspbp.place_id
		 ORDER BY npi.year DESC
		 LIMIT 1),
		NULL
	) AS popularity_jot2_ngo,
	IFNULL(
		(SELECT SUM(percent)
		 FROM ngo_served_percent_by_palces as nspbp
		 LEFT JOIN ngos on ngos.id = ngo_id
		 WHERE ngos.ngo_jots_id = 2 AND places.id = nspbp.place_id
		 LIMIT 1),
		NULL
	) AS popularity_jot2
FROM `places`
	LEFT JOIN ngo_category_bs ON places.id = ngo_category_bs.place_id
	LEFT JOIN ngo_categories ON ngo_category_bs.ngo_category_id = ngo_categories.id
	LEFT JOIN ngo_place_info2 AS npi on places.id = npi.place_id
GROUP BY places.id;
*/
var decryptHash = (value) => {
	// return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
	const passphrase = '123';
	const bytes = CryptoJS.AES.decrypt(value, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
};

exports.finalReportGenerateOfficerProfileNGO_new = async (req, res) => {
	let query = ' where years.name = year(curdate())';

	if (req.body.division_id != '') {
		if (query.includes('where')) {
			query += ` and places.division_id = ${req.body.division_id}`;
		} else {
			query += ` where places.division_id = ${req.body.division_id}`;
		}
	}
	if (req.body.district_id != '') {
		if (query.includes('where')) {
			query += ` and places.district_id = '${req.body.district_id}'`;
		} else {
			query += ` where places.district_id = '${req.body.district_id}'`;
		}
	}
	if (req.body.place_id != '') {
		if (query.includes('where')) {
			query += ` and places.id = '${req.body.place_id}'`;
		} else {
			query += ` where places.id = '${req.body.place_id}'`;
		}
	}
	if (req.body.heading_id != '') {
		if (query.includes('where')) {
			query += ` and heading_id = '${req.body.heading_id}'`;
		} else {
			query += ` where heading_id = '${req.body.heading_id}'`;
		}
	}

	if (req.body.type_id != '') {
		if (query.includes('where')) {
			query += ` and officer_profile_headings.type = '${req.body.type_id}'`;
		} else {
			query += ` where officer_profile_headings.type = '${req.body.type_id}'`;
		}
	}

	if (req.body.ngo_id !== '') {
		if (query.includes('where')) {
			query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`;
		} else {
			query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`;
		}
	}
	const [alldata, metadata] = await sequelize.query(
		`SELECT *,GROUP_CONCAT ( DISTINCT heading) as multiple_heading,GROUP_CONCAT ( DISTINCT officers_heading_descriptions.desc) as multiple_desc,places.id as place_id,places.name as place_name,officers.name as officer_name,ngos.name as ngo_name,ngos.id as ngo_id FROM year_place_ngo_officers LEFT JOIN officers_heading_descriptions ON year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.officer_id left join officer_profile_headings on officer_profile_headings.id = officers_heading_descriptions.heading_id left join years on years.id = year_place_ngo_officers.year_id left join places on places.id = year_place_ngo_officers.place_id left join officers on officers.id = year_place_ngo_officers.officer_id left join ngos on ngos.id = year_place_ngo_officers.ngo_id` +
		query
	);
	if (alldata.length > 0) {
		let final_data = [];
		for (let i = 0; i < alldata.length; i++) {
			let current_desc = alldata[i].desc;
			let decoded_desc = '';
			if (current_desc) {
				decoded_desc = decryptHash(current_desc);
			} else {
				decoded_desc = '';
			}
			alldata[i].desc = decoded_desc;
			final_data.push(alldata[i]);
		}
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			final_data
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateOfficerProfileNGO = async (req, res) => {
	let query = 'where years.id = (select MAX(id) from years)';
	let type = '';
	let heading = '';
	let headingType = '';
	let descType = '';
	let headingDesc = '';

	if (req.body.division_id != '') {
		if (query.includes('where')) {
			query += ` and places.division_id = ${req.body.division_id}`;
		} else {
			query += ` where places.division_id = ${req.body.division_id}`;
		}
	}
	if (req.body.district_id != '') {
		if (query.includes('where')) {
			query += ` and places.district_id = '${req.body.district_id}'`;
		} else {
			query += ` where places.district_id = '${req.body.district_id}'`;
		}
	}
	if (req.body.place_id != '') {
		if (query.includes('where')) {
			query += ` and places.id = '${req.body.place_id}'`;
		} else {
			query += ` where places.id = '${req.body.place_id}'`;
		}
	}
	if (req.body.heading_id != '') {
		// if(heading.includes('where')){
		heading += ` and id = '${req.body.heading_id}'`;
		headingDesc += ` and heading_id = '${req.body.heading_id}'`;
		// }else{
		//     heading += ` where heading_id = '${req.body.heading_id}'`
		// }
	}

	if (req.body.type_id != '') {
		if (type.includes('where')) {
			type += ` and officer_profile_headings.type_id = '${req.body.type_id}'`;
			headingType += ` and officer_profile_headings.type = '${req.body.type_id}'`;
		} else {
			type += ` where id = '${req.body.type_id}'`;
			headingType += ` where officer_profile_headings.type = '${req.body.type_id}'`;
		}
		descType += ` and officer_profile_headings.type = '${req.body.type_id}'`;
	}

	if (req.body.ngo_id !== '') {
		if (query.includes('where')) {
			query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`;
		} else {
			query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`;
		}
	}
	// const [alldata, metadata] = await sequelize.query(`SELECT *,places.id as place_id,places.name as place_name,officers.name as officer_name,ngos.name as ngo_name,ngos.id as ngo_id FROM year_place_ngo_officers LEFT JOIN officers_heading_descriptions ON year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.officer_id left join officer_profile_headings on officer_profile_headings.id = officers_heading_descriptions.heading_id left join years on years.id = year_place_ngo_officers.year_id left join places on places.id = year_place_ngo_officers.place_id left join officers on officers.id = year_place_ngo_officers.officer_id left join ngos on ngos.id = year_place_ngo_officers.ngo_id`+query);
	// const [alldata, metadata] = await sequelize.query(
	// 	`select (select GROUP_CONCAT(concat(id,'/-/',type)) from profile_types ${type} ORDER by sort) as type_list,(select GROUP_CONCAT(concat(type,'/-/',id,'/-/',heading)) from officer_profile_headings ${headingType}${heading} ORDER by view_sort,type) heading_list,(select GROUP_CONCAT(CONCAT(heading_id,'/-/',type,'/-/',officers_heading_descriptions.desc)) from officers_heading_descriptions left join officer_profile_headings on officers_heading_descriptions.heading_id = officer_profile_headings.id where officer_id = year_place_ngo_officers.officer_id and year_id = year_place_ngo_officers.year_id ${descType}${headingDesc} order by heading_id) description_list, places.id as place_id,places.name as place_name,ngos.name as ngo_name,officers.name as officer_name,officers.image as officer_photo,places.area from places LEFT join year_place_ngo_officers on year_place_ngo_officers.place_id = places.id LEFT join ngos on ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id left JOIN years on years.id = year_place_ngo_officers.year_id ${query} GROUP by year_place_ngo_officers.officer_id  order by places.id`
	// );
	const [alldata, metadata] = await sequelize.query(`
    SELECT 
        (SELECT GROUP_CONCAT(CONCAT(id, '/-/', type)) FROM profile_types ${type} ORDER BY sort) AS type_list,
        (SELECT GROUP_CONCAT(CONCAT(type, '/-/', id, '/-/', heading)) FROM officer_profile_headings ${headingType}${heading} ORDER BY view_sort, type) AS heading_list,
        (SELECT GROUP_CONCAT(CONCAT(heading_id, '/-/', type, '/-/', officers_heading_descriptions.desc)) 
         FROM officers_heading_descriptions 
         LEFT JOIN officer_profile_headings ON officers_heading_descriptions.heading_id = officer_profile_headings.id 
         WHERE officer_id = year_place_ngo_officers.officer_id 
           AND year_id = year_place_ngo_officers.year_id ${descType}${headingDesc} 
           AND officers_heading_descriptions.desc IS NOT NULL
         ORDER BY heading_id) AS description_list,
        places.id AS place_id, 
        places.name AS place_name,
        ngos.name AS ngo_name,
        officers.name AS officer_name,
        officers.image AS officer_photo,
        places.area
    FROM places
    LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.place_id = places.id
    LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    LEFT JOIN years ON years.id = year_place_ngo_officers.year_id
    ${query}
    GROUP BY year_place_ngo_officers.officer_id
    HAVING description_list IS NOT NULL
    ORDER BY places.id`);
	console.log('alldata', alldata);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('ReportOfficerProfile', reportGenerateInfo);
		let final_data = [];
		for (let i = 0; i < alldata.length; i++) {
			alldata[i].description_list =
				alldata[i].description_list !== null
					? alldata[i].description_list.split(',')?.map((res) => {
						const desc = res.split('/-/');
						console.log(desc[2]);
						const newDesc = decryptHash(desc[2]);
						console.log(newDesc);
						return desc[0].concat('/-/', desc[1]).concat('/-/', newDesc);
					})
					: alldata[i].description_list;
			// let decoded_desc = "";
			// if(current_desc){
			//     decoded_desc = decryptHash(current_desc);
			// }else{
			//     decoded_desc = ""
			// }
			// alldata[i].desc = decoded_desc;
			final_data.push(alldata[i]);
		}
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			final_data
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateAdminOfficer = async (req, res) => {
	let query = '';

	if (req.body.division_id != '') {
		if (query.includes('where')) {
			query += ` and administration_officers.division_id = '${req.body.division_id}'`;
		} else {
			query += ` where administration_officers.division_id = '${req.body.division_id}'`;
		}
	}
	if (req.body.district_id != '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and administration_officers.district_id = '${req.body.district_id}'`;
		} else {
			query += ` where administration_officers.district_id = '${req.body.district_id}'`;
		}
	}
	if (req.body.place_id != '') {
		if (query.includes('where')) {
			query += ` and administration_officers.place_id = '${req.body.place_id}'`;
		} else {
			query += ` where administration_officers.place_id = '${req.body.place_id}'`;
		}
	}

	if (req.body.admin_office_id != '') {
		if (query.includes('where')) {
			query += ` and administration_officer_types.administration_office_id = '${req.body.admin_office_id}'`;
		} else {
			query += ` where administration_officer_types.administration_office_id = '${req.body.admin_office_id}'`;
		}
	}
	if (req.body.admin_officer_type_id != '') {
		if (query.includes('where')) {
			query += ` and administration_officer_types.id = '${req.body.admin_officer_type_id}'`;
		} else {
			query += ` where administration_officer_types.id = '${req.body.admin_officer_type_id}'`;
		}
	}
	query += ` order by administration_offices.ordering, administration_officer_types.view_sort, administration_officers.ordering IS NULL, administration_officers.ordering`;
	const [alldata, metadata] = await sequelize.query(
		`select 
  *, 
  administration_officer_types.name as designation_name, 
  administration_officer_types.id as type_id, 
  administration_offices.name as office_name, 
  administration_officers.name as officer_name,
  ngos.name as ngo_name,
  ngos.short_name as ngo_short_name,
  ngos.color_code as ngo_color_code
from 
  administration_officers 
  left join administration_offices on administration_officers.administration_office_id = administration_offices.id 
  left join administration_officer_types on administration_officers.designation = administration_officer_types.id
  left join ngos on ngos.id = administration_officers.ngo_id` + query
	);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('ReportAdminOfficer', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateResult = async (req, res) => {
	console.log(
		'-------------------finalReportGenerateResult-------------------'
	);
	console.log('req.body.year_id', req.body.year_id);

	let query = '';
	let default_year = '(select id from years order by id DESC LIMIT 1,1)';
	if (req.body.year_id != '' && req.body.year_id !== '1000') {
		const get_year = await years.findOne({ where: { id: req.body.year_id } });
		default_year = get_year.id;
	}
	let year_query = `AND year_place_ngo_officers.year_id = ${default_year}`;
	if (req.body.year_id === '1000') {
		year_query = '';
	}

	if (req.body.division_id != '') {
		if (query.includes('where')) {
			query += ` and division_id = '${req.body.division_id}'`;
		} else {
			query += ` where division_id = '${req.body.division_id}'`;
		}
	}
	if (req.body.district_id != '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_id = '${req.body.district_id}'`;
		} else {
			query += ` where district_id = '${req.body.district_id}'`;
		}
	}
	if (req.body.place_id != '') {
		if (query.includes('where')) {
			query += ` and places.id = '${req.body.place_id}'`;
		} else {
			query += ` where places.id = '${req.body.place_id}'`;
		}
	}
	// if(req.body.ngo_id !== ''){
	//     if(query.includes('where')){
	//         query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
	//     }else{
	//         query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
	//     }
	// }
	// this query will show result even with multiple entry
	// SELECT
	//     places.id AS place_id,
	//     places.name AS place_name,
	//     places.area AS place_area,
	//     places.division_id AS division_id,
	//     places.district_id AS district_id,
	//     officers1.name AS ngo_officer1,
	//     ngos1.name AS ngo1,
	//     ypno1.served_population AS served_population1,
	//     officers2.name AS ngo_officer2,
	//     ngos2.name AS ngo2,
	//     ypno2.served_population AS served_population2
	// FROM places
	// LEFT JOIN year_place_ngo_officers AS ypno1 ON ypno1.place_id = places.id AND ypno1.rank = 1 AND ypno1.year_id = ${req.body.year_id} AND ypno1.event_type = 0
	// LEFT JOIN officers AS officers1 ON officers1.id = ypno1.officer_id
	// LEFT JOIN ngos AS ngos1 ON ngos1.id = ypno1.ngo_id
	// LEFT JOIN year_place_ngo_officers AS ypno2 ON ypno2.place_id = places.id AND ypno2.rank = 2 AND ypno2.year_id = ${req.body.year_id} AND ypno2.event_type = 0
	// LEFT JOIN officers AS officers2 ON officers2.id = ypno2.officer_id
	// LEFT JOIN ngos AS ngos2 ON ngos2.id = ypno2.ngo_id;

	console.log('query', query);
	const [alldata, metadata] = await sequelize.query(
		`SELECT
        places.id AS place_id,
        places.name AS place_name,
        places.area AS place_area,
        places.division_id  AS division_id,
        places.district_id AS district_id,
        (
        SELECT
            officers.name
        FROM
            year_place_ngo_officers
        LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo_officer1,
    (
        SELECT
            ngos.name
        FROM
            year_place_ngo_officers
        LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo1,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS served_population1,
    (
        SELECT
            officers.name
        FROM
            year_place_ngo_officers
        LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo_officer2,
    (
        SELECT
            ngos.name
        FROM
            year_place_ngo_officers
        LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo2,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.event_type = 0
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS served_population2
    FROM
        places` + query
	);
	if (alldata.length > 0) {
		const userId = report.getUserId(req);
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('Reportresult', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateOfficerChange = async (req, res) => {
	let query = "where ngos.ngo_jots_id != ''";
	let default_year = '(select id from years order by id DESC LIMIT 1,1)';

	if (req.body.division_id != '') {
		if (query.includes('where')) {
			query += ` and division_id = '${req.body.division_id}'`;
		} else {
			query += ` where division_id = '${req.body.division_id}'`;
		}
	}
	if (req.body.district_id != '') {
		const get_district = await District.findOne({
			where: { id: req.body.district_id },
		});
		if (query.includes('where')) {
			query += ` and district_id = '${req.body.district_id}'`;
		} else {
			query += ` where district_id = '${req.body.district_id}'`;
		}
	}
	if (req.body.place_id != '') {
		if (query.includes('where')) {
			query += ` and places.id = '${req.body.place_id}'`;
		} else {
			query += ` where places.id = '${req.body.place_id}'`;
		}
	}
	if (req.body.ngo_id !== '') {
		if (query.includes('where')) {
			query += ` and ngo_id = '${req.body.ngo_id}'`;
		} else {
			query += ` where ngo_id = '${req.body.ngo_id}'`;
		}
	}
	const [alldata, metadata] = await sequelize.query(`SELECT
    places.id AS place_id,
    places.name AS place_name,
    ngos.id AS ngo_id,
    places.division_id  AS division_id,
    places.district_id AS district_id,
    (
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    WHERE year_place_ngo_officers.ngo_id = 6 and
        year_place_ngo_officers.place_id = places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
    GROUP BY
        year_place_ngo_officers.ngo_id
) AS ngo_officer1,
(
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    WHERE year_place_ngo_officers.ngo_id = 6 and year_place_ngo_officers.place_id = places.id AND year_place_ngo_officers.year_id = (select id from years order by id DESC LIMIT 1) AND year_place_ngo_officers.status = 0
    GROUP BY
        year_place_ngo_officers.ngo_id
) AS ngo_officer2,
(
    SELECT
        officers.name
    FROM
        year_place_ngo_officers
    LEFT JOIN officers ON officers.id = year_place_ngo_officers.officer_id
    WHERE year_place_ngo_officers.ngo_id = 6 and year_place_ngo_officers.place_id = places.id AND year_place_ngo_officers.year_id = (select id from years order by id DESC LIMIT 1) AND year_place_ngo_officers.status = 1
    GROUP BY
        year_place_ngo_officers.ngo_id
) AS ngo_officer3,
(
    SELECT
        ngo_categories.short_name
    FROM
        ngo_category_bs
    LEFT JOIN ngo_categories ON ngo_categories.id = ngo_category_bs.ngo_category_id
    WHERE ngo_category_bs.place_id = places.id
) AS categoryType
,ngos.short_name
FROM
    places
    LEFT JOIN ngos on ngos.id = places.ngo_id
     ${query}`);
	if (alldata.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.YearGet = async (req, res) => {
	const year = req.params.year;
	const [year_data, metadata] = await sequelize.query(
		`select * from years where name=${year}`
	);
	if (year_data.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'year fetch successfully.',
			year_data[0]
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.LatestYearGet = async (req, res) => {
	const [year_data, metadata] = await sequelize.query(
		`select id,name from years order by id DESC LIMIT 1,1`
	);
	if (year_data.length > 0) {
		return apiResponse.successResponseWithData(
			res,
			'year fetch successfully.',
			year_data[0]
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};
