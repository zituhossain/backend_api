const apiResponse = require('../helpers/apiResponse');
const updatePlaceQueue = require('../updatePlaceQueue');
const {
	sequelize,
	years,
	Place
} = require('../models');

// Child Functions

const fetchCategoryDataJson = async (place_id) => {

	const [category, categoryMeta] = await sequelize.query(
		`SELECT
		ngo_categories.color_code,
		ngo_categories.short_name,
		ngo_categories.name,
		ngo_categories.values
		FROM ngo_categories
		LEFT JOIN ngo_category_bs ON ngo_categories.id = ngo_category_bs.ngo_category_id
		WHERE ngo_categories.type = 1 AND ngo_category_bs.place_id = ${place_id}`
	);

	return category;
};

const fetchTypeDataJson = async (place_id) => {
	const [type, typeMeta] = await sequelize.query(
		`SELECT
		ngo_categories.color_code,
		ngo_categories.short_name,
		ngo_categories.name
		FROM ngo_categories
		LEFT JOIN ngo_category_bs ON ngo_categories.id = ngo_category_bs.ngo_category_type_id
		WHERE ngo_categories.type = 0 AND ngo_category_bs.place_id = ${place_id}`
	);
	return type;
};

const fetchJot1OfficerDataJson = async (place_id) => {
	const [jot1Officer, jot1OfficerMeta] = await sequelize.query(
		`SELECT 
		ypno.id ypno_id,
		ypno.event_type ypno_event_type,
		ypno.officer_direct_age ypno_officer_direct_age,
		ypno.popularity ypno_popularity,
		ypno.comment ypno_comment,
		ypno.comment2 ypno_comment2,
		ypno.served_population ypno_served_population,
		ypno.percent_served ypno_percent_served,
		ypno.rank ypno_rank,
		ypno.view_order ypno_view_order,
		ypno.status ypno_status,
		ypno.designation ypno_designation,
		ypno.place_id ypno_place_id,
		places.id place_id,
		officers.name officer_name,
		officers.image officer_photo,
		ngos.name ngo_name,
		ngos.id ngo_id,
		ngos.ngo_jots_id ngo_jot_id
		FROM year_place_ngo_officers ypno
		LEFT JOIN officers
		ON ypno.officer_id = officers.id 
		LEFT JOIN ngos
		ON ypno.ngo_id = ngos.id
		LEFT JOIN places
		on places.id = ypno.place_id
		WHERE ypno.year_id = (SELECT max(year_id) FROM year_place_ngo_officers) AND ngos.ngo_jots_id = 1 AND ypno.place_id = ${place_id}
		AND ypno.rank < 1 ORDER BY ypno.place_id, -ngos.ngo_jots_id DESC, FIELD(ypno.status, 1, 3, 2, 0), -ngos.view_order DESC, -ypno.view_order DESC, ypno.officer_id`
	);
	return jot1Officer;
};

const fetchJot2OfficerDataJson = async (place_id) => {
	const [jot2Officer, jot2OfficerMeta] = await sequelize.query(
		`SELECT 
		ypno.id ypno_id,
		ypno.event_type ypno_event_type,
		ypno.officer_direct_age ypno_officer_direct_age,
		ypno.popularity ypno_popularity,
		ypno.comment ypno_comment,
		ypno.comment2 ypno_comment2,
		ypno.served_population ypno_served_population,
		ypno.percent_served ypno_percent_served,
		ypno.rank ypno_rank,
		ypno.view_order ypno_view_order,
		ypno.status ypno_status,
		ypno.designation ypno_designation,
		ypno.place_id ypno_place_id,
		places.id place_id,
		officers.name officer_name,
		officers.image officer_photo,
		ngos.name ngo_name,
		ngos.id ngo_id,
		ngos.ngo_jots_id ngo_jot_id
		FROM year_place_ngo_officers ypno LEFT JOIN officers
		ON ypno.officer_id = officers.id LEFT JOIN ngos
		ON ypno.ngo_id = ngos.id
		LEFT JOIN places
		on places.id = ypno.place_id
		WHERE ypno.year_id = (SELECT max(year_id) FROM year_place_ngo_officers) AND ngos.ngo_jots_id != 1 AND ypno.place_id = ${place_id}
		AND ypno.rank < 1 ORDER BY ypno.place_id, -ngos.ngo_jots_id DESC, FIELD(ypno.status, 1, 3, 2, 0), -ngos.view_order DESC, -ypno.view_order DESC, ypno.officer_id`
	);
	return jot2Officer;
};


const fetchNgoServedPercentByPlaceDataJson = async (place_id) => {
	const [ngoServedPercentByPlace, ngoServedPercentByPlaceMeta] = await sequelize.query(
		`SELECT
		ngos.id as ngo_id,
		ngos.name as ngo_name,
		nspbp.percent,
		ngos.view_order
		FROM ngo_served_percent_by_palces nspbp LEFT JOIN ngos
		ON ngos.id = nspbp.ngo_id
		WHERE nspbp.place_id = ${place_id}
		ORDER BY ngos.view_order`
	);
	return ngoServedPercentByPlace;
};

const fetchJotPopularityData = async (place_id) => {
	const [jotPopularity, jotPopularityMeta] = await sequelize.query(
		`SELECT 
		nspbp.place_id,
		SUM(CASE WHEN ngos.ngo_jots_id = 1 THEN percent END) AS jot1Popularity, 
		SUM(CASE WHEN ngos.ngo_jots_id = 2 THEN percent END) AS jot2Popularity 
		FROM ngo_served_percent_by_palces nspbp LEFT JOIN ngos 
		ON nspbp.ngo_id = ngos.id
		WHERE nspbp.place_id = ${place_id}`
	);
	return jotPopularity;
};

const fetchPlaceCommentWithTitleDataJson = async (place_id) => {
	const [placeCommentWithTitle, placeCommentWithTitleMeta] = await sequelize.query(
		`SELECT
		ndi.id ngo_details_info_id,
		ndi.title,
		ndi.view_order,
		ndipw.details
		FROM ngo_details_infos ndi LEFT JOIN ngo_details_info_point_wises ndipw
		ON ndi.id = ndipw.ngo_details_info_id
		WHERE ndipw.place_id = ${place_id}
		ORDER BY  ndi.view_order`
	);
	return placeCommentWithTitle;
};

const fetchNgoPopularOfficerDataJson = async (place_id) => {
	const [ngoPopularOfficer, ngoPopularOfficerMeta] = await sequelize.query(
		`SELECT
		years.id as year_id,
		years.bn_name as bn_name,
		years.bn_term as bn_term,
		ypno.id as ypno_id,
		ypno.event_type as ypno_event_type,
		ypno.ngo_id as ypno_ngo_id,
		ypno.rank as ypno_rank,
		ypno.served_population as ypno_served_population,
		places.name as place_name,
		places.id as place_id,
		ngos.name as ngo_name,
		ngos.short_name as ngo_short_name,
		ngos.color_code as ngo_color_code,
		officers.name as officer_name,
		officers.id as officer_id,
		officers.image as officer_image
		FROM year_place_ngo_officers ypno LEFT JOIN officers
		ON ypno.officer_id = officers.id LEFT JOIN ngos
		ON ypno.ngo_id = ngos.id LEFT JOIN years
		ON ypno.year_id = years.id LEFT JOIN places
		ON ypno.place_id = places.id
		WHERE ypno.rank = 1 AND ypno.place_id = ${place_id}
		ORDER BY year_id DESC
		LIMIT 1`
	);
	return ngoPopularOfficer;
};

const fetchNgoPlaceHistoryDataJson = async (place_id) => {
	const [ngoPlaceHistory, ngoPlaceHistoryMeta] = await sequelize.query(
		`SELECT
			years.id as year_id,
			years.bn_name as bn_name,
			years.bn_term as bn_term,
			years.type as year_type,
			ypno.id as ypno_id,
			ypno.event_type as ypno_event_type,
			ypno.year_id as ypno_year_id,
			ypno.place_id as ypno_place_id,
			ypno.ngo_id as ypno_ngo_id,
			ypno.rank as ypno_rank,
			ypno.served_population as ypno_served_population,
			places.name as place_name,
			places.id as place_id,
			ngos.name as ngo_name,
			ngos.short_name as ngo_short_name,
			ngos.color_code as ngo_color_code,
			ngos.logo as ngo_logo,
			officers.name as officer_name,
			CASE WHEN population_year_places.event_type = 1 THEN population_year_places.served_population END AS sub_event_population,
			CASE WHEN population_year_places.event_type = 0 THEN population_year_places.served_population END AS main_event_population
		FROM year_place_ngo_officers ypno
			LEFT JOIN years on years.id = ypno.year_id
			LEFT JOIN places on places.id = ypno.place_id
			LEFT JOIN ngos on ngos.id = ypno.ngo_id
			LEFT JOIN officers on officers.id = ypno.officer_id
			LEFT JOIN population_year_places ON ypno.year_id = population_year_places.year_id AND ypno.place_id = population_year_places.place_id AND ypno.event_type = population_year_places.event_type
			WHERE
				places.id = ${place_id}
				AND ypno.rank IS NOT NULL
				AND ypno.rank <> 0				
			ORDER BY
			years.id DESC, ypno.event_type DESC,ypno.rank ASC`
	);

	// Process the data
	// const groupedByYear = ngoPlaceHistory.reduce((result, item) => {
	// 	const { year_id } = item;
	// 	if (!result[year_id]) {
	// 		result[year_id] = [];
	// 	}
	// 	result[year_id].push(item);
	// 	return result;
	// }, {});

	// // Convert the grouped data into an array of objects
	// const groupedArray = Object.entries(groupedByYear).map(([year_id, data]) => ({
	// 	year_id: Number(year_id),
	// 	data,
	// }));
const regroupedData = ngoPlaceHistory.reduce((acc, item) => {
  const { year_id, ypno_event_type } = item;
  const key = `${year_id}_${ypno_event_type}`;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(item);
  return acc;
}, {});

const groupedArray = Object.values(regroupedData);
	return groupedArray; // Return the processed data
};

const fetchPopulationByPlaceDataJson = async (place_id) => {
	const [populationByPlace, populationByPlaceMeta] = await sequelize.query(
		`SELECT 
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
	  WHERE places.id = ${place_id} 
	  AND  pyp.year_id = (
		  SELECT 
			MAX(id) AS year_id 
		  FROM 
			years
		)`
	);

	return populationByPlace;
}

// Mother Function

exports.combineDetailsReport = async (req, res) => {
	try {

		const id = req.params.id;

		// const categoryData = await this.categoryById(id);

		// console.log("categoryData", categoryData)

		const [place, metadata] = await sequelize.query(
			`SELECT
			places.id, 
			places.name, 
			places.area
			FROM places
			WHERE id = ${id}`
		);

		const place_id = place.length > 0 ? place[0].id : null;
		const place_name = place.length > 0 ? place[0].name : null;
		const place_area = place.length > 0 ? place[0].area : null;

		const [category, categoryMeta] = await sequelize.query(
			`SELECT
			ngo_categories.color_code,
			ngo_categories.short_name,
			ngo_categories.name,
			ngo_categories.values
			FROM ngo_categories
        	LEFT JOIN ngo_category_bs ON ngo_categories.id = ngo_category_bs.ngo_category_id
        	WHERE ngo_categories.type = 1 AND ngo_category_bs.place_id = ${place_id}`
		);

		const [type, typeMeta] = await sequelize.query(
			`SELECT
			ngo_categories.color_code,
			ngo_categories.short_name,
			ngo_categories.name
			FROM ngo_categories
        	LEFT JOIN ngo_category_bs ON ngo_categories.id = ngo_category_bs.ngo_category_type_id
        	WHERE ngo_categories.type = 0 AND ngo_category_bs.place_id = ${place_id}`
		);

		const [jot1Officer, jot1OfficerMeta] = await sequelize.query(
			`SELECT 
			ypno.id ypno_id,
			ypno.event_type ypno_event_type,
			ypno.officer_direct_age ypno_officer_direct_age,
			ypno.popularity ypno_popularity,
			ypno.comment ypno_comment,
			ypno.comment2 ypno_comment2,
			ypno.served_population ypno_served_population,
			ypno.percent_served ypno_percent_served,
			ypno.rank ypno_rank,
			ypno.view_order ypno_view_order,
			ypno.status ypno_status,
			ypno.designation ypno_designation,
			ypno.place_id ypno_place_id,
			places.id place_id,
			officers.name officer_name,
			officers.image officer_photo,
			ngos.name ngo_name,
			ngos.id ngo_id,
			ngos.ngo_jots_id ngo_jot_id
			FROM year_place_ngo_officers ypno
			LEFT JOIN officers
			ON ypno.officer_id = officers.id 
			LEFT JOIN ngos
			ON ypno.ngo_id = ngos.id
			LEFT JOIN places
			on places.id = ypno.place_id
			WHERE ypno.year_id = (SELECT max(year_id) FROM year_place_ngo_officers) AND ngos.ngo_jots_id = 1 AND ypno.place_id = ${place_id}
			AND ypno.rank < 1 ORDER BY ypno.place_id, -ngos.ngo_jots_id DESC, FIELD(ypno.status, 1, 3, 2, 0), -ngos.view_order DESC, -ypno.view_order DESC, ypno.officer_id`
		);

		const [jot2Officer, jot2OfficerMeta] = await sequelize.query(
			`SELECT 
			ypno.id ypno_id,
			ypno.event_type ypno_event_type,
			ypno.officer_direct_age ypno_officer_direct_age,
			ypno.popularity ypno_popularity,
			ypno.comment ypno_comment,
			ypno.comment2 ypno_comment2,
			ypno.served_population ypno_served_population,
			ypno.percent_served ypno_percent_served,
			ypno.rank ypno_rank,
			ypno.view_order ypno_view_order,
			ypno.status ypno_status,
			ypno.designation ypno_designation,
			ypno.place_id ypno_place_id,
			places.id place_id,
			officers.name officer_name,
			officers.image officer_photo,
			ngos.name ngo_name,
			ngos.id ngo_id,
			ngos.ngo_jots_id ngo_jot_id
			FROM year_place_ngo_officers ypno LEFT JOIN officers
			ON ypno.officer_id = officers.id LEFT JOIN ngos
			ON ypno.ngo_id = ngos.id
			LEFT JOIN places
			on places.id = ypno.place_id
			WHERE ypno.year_id = (SELECT max(year_id) FROM year_place_ngo_officers) AND ngos.ngo_jots_id != 1 AND ypno.place_id = ${place_id}
			AND ypno.rank < 1 ORDER BY ypno.place_id, -ngos.ngo_jots_id DESC, FIELD(ypno.status, 1, 3, 2, 0), -ngos.view_order DESC, -ypno.view_order DESC, ypno.officer_id`
		);

		const [ngoPlaceHistory, ngoPlaceHistoryMeta] = await sequelize.query(
			`SELECT
			years.id as year_id,
			years.bn_name as bn_name,
			years.bn_term as bn_term,
			years.type as year_type,
			ypno.id as ypno_id,
			ypno.event_type as ypno_event_type,
			ypno.year_id as ypno_year_id,
			ypno.place_id as ypno_place_id,
			ypno.ngo_id as ypno_ngo_id,
			ypno.rank as ypno_rank,
			ypno.served_population as ypno_served_population,
			places.name as place_name,
			places.id as place_id,
			ngos.name as ngo_name,
			ngos.short_name as ngo_short_name,
			ngos.color_code as ngo_color_code,
			ngos.logo as ngo_logo,
			officers.name as officer_name,
			CASE WHEN population_year_places.event_type = 1 THEN population_year_places.served_population END AS sub_event_population,
			CASE WHEN population_year_places.event_type = 0 THEN population_year_places.served_population END AS main_event_population
		FROM year_place_ngo_officers ypno
			LEFT JOIN years on years.id = ypno.year_id
			LEFT JOIN places on places.id = ypno.place_id
			LEFT JOIN ngos on ngos.id = ypno.ngo_id
			LEFT JOIN officers on officers.id = ypno.officer_id
			LEFT JOIN population_year_places ON ypno.year_id = population_year_places.year_id AND ypno.place_id = population_year_places.place_id AND ypno.event_type = population_year_places.event_type
			WHERE
				places.id = ${place_id}
				AND ypno.rank IS NOT NULL
				AND ypno.rank <> 0				
			ORDER BY
			years.id desc, ypno.event_type DESC,ypno.rank ASC`
		);

		const [ngoServedPercentByPlace, ngoServedPercentByPlaceMeta] = await sequelize.query(
			`SELECT
            ngos.id as ngo_id,
			ngos.name as ngo_name,
			nspbp.percent,
			ngos.view_order
			FROM ngo_served_percent_by_palces nspbp LEFT JOIN ngos
			ON ngos.id = nspbp.ngo_id
			WHERE nspbp.place_id = ${place_id}
			ORDER BY ngos.view_order`
		);

		const [jotPopularity, jotPopularityMeta] = await sequelize.query(
			`SELECT 
            nspbp.place_id,
            SUM(CASE WHEN ngos.ngo_jots_id = 1 THEN percent END) AS jot1Popularity, 
            SUM(CASE WHEN ngos.ngo_jots_id = 2 THEN percent END) AS jot2Popularity 
            FROM ngo_served_percent_by_palces nspbp LEFT JOIN ngos 
            ON nspbp.ngo_id = ngos.id
            WHERE nspbp.place_id = ${place_id}`
		);

		const [placeCommentWithTitle, placeCommentWithTitleMeta] = await sequelize.query(
			`SELECT
            ndi.id ngo_details_info_id,
            ndi.title,
            ndi.view_order,
            ndipw.details
            FROM ngo_details_infos ndi LEFT JOIN ngo_details_info_point_wises ndipw
            ON ndi.id = ndipw.ngo_details_info_id
            WHERE ndipw.place_id = ${place_id}
			ORDER BY  ndi.view_order`
		);

		const [ngoPopularOfficer, ngoPopularOfficerMeta] = await sequelize.query(
			`SELECT
            years.id as year_id,
            years.bn_name as bn_name,
            years.bn_term as bn_term,
            ypno.id as ypno_id,
            ypno.event_type as ypno_event_type,
            ypno.ngo_id as ypno_ngo_id,
            ypno.rank as ypno_rank,
            ypno.served_population as ypno_served_population,
            places.name as place_name,
            places.id as place_id,
            ngos.name as ngo_name,
            ngos.short_name as ngo_short_name,
            ngos.color_code as ngo_color_code,
            officers.name as officer_name,
            officers.id as officer_id,
            officers.image as officer_image
            FROM year_place_ngo_officers ypno LEFT JOIN officers
            ON ypno.officer_id = officers.id LEFT JOIN ngos
            ON ypno.ngo_id = ngos.id LEFT JOIN years
            ON ypno.year_id = years.id LEFT JOIN places
            ON ypno.place_id = places.id
			WHERE ypno.rank = 1 AND ypno.place_id = ${place_id}
			ORDER BY year_id DESC
			LIMIT 1`
		);

		const [populationByPlace, populationByPlaceMeta] = await sequelize.query(
			`SELECT 
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
		  WHERE places.id = ${place_id} 
		  AND  pyp.year_id = (
			  SELECT 
				MAX(id) AS year_id 
			  FROM 
				years
			)`
		);

		// const groupedByYear = ngoPlaceHistory.reduce((result, item) => {
		// 	const { year_id } = item;
		// 	if (!result[year_id]) {
		// 		result[year_id] = [];
		// 	}
		// 	result[year_id].push(item);
		// 	return result;
		// }, {});

		// // Convert the grouped data into an array of objects
		// const groupedArray = Object.entries(groupedByYear).map(([year_id, data]) => ({
		// 	year_id: Number(year_id),
		// 	data,
		// }));

const regroupedData = ngoPlaceHistory.reduce((acc, item) => {
  const { year_id, ypno_event_type } = item;
  const key = `${year_id}_${ypno_event_type}`;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(item);
  return acc;
}, {});

const groupedArray = Object.values(regroupedData);


		const combinedData = {
			place_id: place_id,
			place_name: place_name,
			place_area: place_area,
			category: category,
			type: type,
			jot1Officer: jot1Officer,
			jot2Officer: jot2Officer,
			ngoPlaceHistory: groupedArray,
			ngoServedPercentByPlace: ngoServedPercentByPlace,
			jotPopularity: jotPopularity,
			placeCommentWithTitle: placeCommentWithTitle,
			ngoPopularOfficer: ngoPopularOfficer,
			populationByPlace: populationByPlace
		}

		// Update the Place table with the combined data
		updatePlaceQueue.add({ placeId: place_id, updatedData: combinedData });

		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			combinedData)
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}


exports.createChildJson = async (id, objectName) => {
	let [mainObject, mainObjectMeta] = await sequelize.query(
		`SELECT updated_json FROM places WHERE id = ${id}`
	);

	if (objectName === "ngoServedPercentByPlace") {
		const ngoServedPercentByPlace = await fetchNgoServedPercentByPlaceDataJson(id);
		mainObject[0].updated_json.ngoServedPercentByPlace = ngoServedPercentByPlace;
	}
	else if (objectName === "placeCommentWithTitle") {
		const placeCommentWithTitle = await fetchPlaceCommentWithTitleDataJson(id);
		mainObject[0].updated_json.placeCommentWithTitle = placeCommentWithTitle;
	}
	else if (objectName === "populationByPlace") {
		const populationByPlace = await fetchPopulationByPlaceDataJson(id);
		mainObject[0].updated_json.populationByPlace = populationByPlace;
	}
	// else if (objectName === "jot1Officer") {
	// 	const jot1Officer = await fetchJot1OfficerDataJson(id);
	// 	mainObject[0].updated_json.jot1Officer = jot1Officer;
	// }
	// else if (objectName === "jot2Officer") {
	// 	const jot2Officer = await fetchJot2OfficerDataJson(id);
	// 	mainObject[0].updated_json.jot2Officer = jot2Officer;
	// }
	// else if (objectName === "ngoPopularOfficer") {
	// 	const ngoPopularOfficer = await fetchNgoPopularOfficerDataJson(id);
	// 	mainObject[0].updated_json.ngoPopularOfficer = ngoPopularOfficer;
	// }
	else if (objectName[0] === "ngoPopularOfficer" && objectName[1] === "jot1Officer" && objectName[2] === "jot2Officer" && objectName[3] === "ngoPlaceHistory") {
		const ngoPopularOfficer = await fetchNgoPopularOfficerDataJson(id);
		mainObject[0].updated_json.ngoPopularOfficer = ngoPopularOfficer;
		const jot1Officer = await fetchJot1OfficerDataJson(id);
		mainObject[0].updated_json.jot1Officer = jot1Officer;
		const jot2Officer = await fetchJot2OfficerDataJson(id);
		mainObject[0].updated_json.jot2Officer = jot2Officer;
		const ngoPlaceHistory = await fetchNgoPlaceHistoryDataJson(id);
		mainObject[0].updated_json.ngoPlaceHistory = ngoPlaceHistory;
	}
	else if (objectName[0] === "type" && objectName[1] === "category") {
		const category = await fetchCategoryDataJson(id);
		const type = await fetchTypeDataJson(id);
		mainObject[0].updated_json.category = category;
		mainObject[0].updated_json.type = type;
	}

	updatePlaceQueue.add({ placeId: id, updatedData: mainObject[0].updated_json });
	return true;
}

exports.getPlaceDetailsAllMongo = async (req, res) => {
	try {
		const page = parseInt(req.body.page) + 1; // Get the current page from the request query or default to page 1
		const pageSize = parseInt(req.body.pageSize) || 10; // Get the page size from the request query or default to 10
		const offset = (page - 1) * pageSize; // Calculate the offset
		let placeIds;
		const yearRow = await years.findOne({
			order: [['name', 'DESC']],
		});
console.log("---------------------inside getPlaceDetailsAllMongo--------------------");
console.log(req.body);
		let year = yearRow.id;

		let query = [];

		console.log('fsddsds====>', page, pageSize);

		if (
			req.body.division_id !== '' &&
			req.body.district_id !== '' &&
			req.body.place_id !== ''
		) {
			query.push({ id: req.body.place_id });
		}

		if (req.body.division_id !== '') {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: req.body.division_id,
				},
				//limit: pageSize, // Limit the number of results per page
				//offset: offset, // Skip the appropriate number of rows based on the current page
			});
			placeIds = places.map((place) => place.id);
			console.log('placeIds------------------', placeIds);
			query.push({ id: placeIds });
		}
		if (req.body.division_id !== '' && req.body.district_id !== '') {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: req.body.district_id,
				},
				limit: pageSize, // Limit the number of results per page
				offset: offset, // Skip the appropriate number of rows based on the current page
			});
			placeIds = places.map((place) => place.id);
			query.push({ id: placeIds });
		}

		const place_data = await Place.findAll({
			attributes: ['updated_json'],
			where: query,
			limit: pageSize, // Limit the number of results per page
			offset: offset,
		})

		const updatedJsonValues = place_data.map(entry => entry.updated_json);
console.log('updatedJsonValues',updatedJsonValues);
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			{
				data: updatedJsonValues, // Your array elements or JSON data
				counter: placeIds ? placeIds.length : null, // Your additional data (you can replace 42 with the desired value)
			}
		);
	} catch (err) {
		console.log("---------------------error getPlaceDetailsAllMongo--------------------");
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getPlaceDetailsByIdMongo = async (req, res) => {
	try {
		const place_data = await Place.findOne({
			attributes: ['updated_json'],
			where: {id:req.params.id},
		})

		return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_data
			);
	} catch (err) {
		console.log("---------------------error getPlaceDetailsByIdMongo--------------------");
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//module.exports = { combineDetailsReport, createChildJson, fetchCategoryDataJson, fetchTypeDataJson, fetchJot1OfficerDataJson, fetchJot2OfficerDataJson, fetchNgoServedPercentByPlaceDataJson, fetchJotPopularityData, fetchPlaceCommentTitleDataJson, fetchNgoPopularOfficerDataJson, fetchNgoPlaceHistoryDataJson, fetchPopulationByPlaceDataJson }