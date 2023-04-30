const apiResponse = require('../helpers/apiResponse');
const report = require('../helpers/reportLog');
const {
	Division,
	District,
	Place,
	year_place_ngo_officer,
	Ngo,
	years,
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
exports.finalReportGenerate = async (req, res) => {
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
			query += ` and categoryb_id = '${req.body.category}'`;
		} else {
			query += ` where categoryb_id = '${req.body.category}'`;
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
			query += ` and categoryb_id = '${req.body.category}'`;
		} else {
			query += ` where categoryb_id = '${req.body.category}'`;
		}
	}
	// const [alldata, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info` + query + ` GROUP BY officer_name`);
	console.log('custome_query', custome_query);
	const [alldata, metadata] = await sequelize.query(
		`SELECT ngo_place_info.*,(select name from ngo_jots limit 1) jot1,(select ngo_name from ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select officers.name from year_place_ngo_officers LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id LEFT JOIN ngos ON ngos.id = year_place_ngo_officers.ngo_id where years.name =(select years.name from years order by id DESC LIMIT 1,1) and year_place_ngo_officers.place_id = ngo_place_info.place_id AND ngos.ngo_jots_id = (select id from ngo_jots limit 1) limit 1) as ngo_officer ${custome_query} FROM ngo_place_info` +
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

exports.finalReportGenerateJotPopularity = async (req, res) => {
	let query = '';

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
		const reportGenerateInfo = report.generateReportInfo(userId, alldata, req);
		console.log('ReportJotPopularity', reportGenerateInfo);

		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.finalReportGenerateDoubleNGO = async (req, res) => {
	let query = ' where categoryb_name IS NOT NULL ';
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
	let query = ' where categoryb_name IS NOT NULL ';
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
		console.log('ReportPossibilityJot', reportGenerateInfo);
		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			alldata
		);
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

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
	const [alldata, metadata] = await sequelize.query(
		`select (select GROUP_CONCAT(concat(id,'/-/',type)) from profile_types ${type} ORDER by sort) as type_list,(select GROUP_CONCAT(concat(type,'/-/',id,'/-/',heading)) from officer_profile_headings ${headingType}${heading} ORDER by view_sort,type) heading_list,(select GROUP_CONCAT(CONCAT(heading_id,'/-/',type,'/-/',officers_heading_descriptions.desc)) from officers_heading_descriptions left join officer_profile_headings on officers_heading_descriptions.heading_id = officer_profile_headings.id where officer_id = year_place_ngo_officers.officer_id and year_id = year_place_ngo_officers.year_id ${descType}${headingDesc} order by heading_id) description_list, places.id as place_id,places.name as place_name,ngos.name as ngo_name,officers.name as officer_name,officers.image as officer_photo,places.area from places LEFT join year_place_ngo_officers on year_place_ngo_officers.place_id = places.id LEFT join ngos on ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN officers on officers.id = year_place_ngo_officers.officer_id left JOIN years on years.id = year_place_ngo_officers.year_id ${query} GROUP by year_place_ngo_officers.officer_id  order by places.id`
	);
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
	if (req.body.admin_office_type_id != '') {
		if (query.includes('where')) {
			query += ` and administration_officer_types.id = '${req.body.admin_office_type_id}'`;
		} else {
			query += ` where administration_officer_types.id = '${req.body.admin_office_type_id}'`;
		}
	}
	const [alldata, metadata] = await sequelize.query(
		`select *,administration_officer_types.name as admin_office_type_name,administration_officer_types.id as admin_office_type_id,administration_offices.name as present_office,administration_officers.name as officer_name,administration_offices.name as office_name from administration_officers left join administration_offices on administration_officers.administration_office_id = administration_offices.id left join districts on administration_officers.district_id = districts.id left join administration_officer_types on administration_officers.designation  = administration_officer_types.id` +
			query
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
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
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
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo1,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
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
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
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
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo2,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = places.id ${year_query} AND year_place_ngo_officers.status = 1
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
    WHERE ngo_category_bs.place_id = places.id and status = 'colorActive'
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
