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

const fetchAllCategoryDataJson = async (place_id) => {

	const [categories, categoriesMeta] = await sequelize.query(
		`SELECT
		ngo_categories.color_code,
		ngo_categories.short_name,
		ngo_categories.name,
		ngo_categories.values
		FROM ngo_categories
		WHERE ngo_categories.type = 1`
	);

	return categories;
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

const fetchJotPopularityDataJson = async (place_id) => {
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

const fetchJot1FinalOfficerDataJson = async (place_id) => {
	const [jot1FinalOfficer, jot1FinalOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		WHERE
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 1 
		AND ypno1.status = 1 
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot1FinalOfficer;
}
const fetchJot1ChangeOfficerDataJson = async (place_id) => {
	const [jot1ChangeOfficer, jot1ChangeOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ypno1.view_order, NULL) ypno_view_order,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity
		FROM year_place_ngo_officers ypno1  LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		WHERE  
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 1 
		AND ypno1.status = 3
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC`
	);

	return jot1ChangeOfficer;
}
const fetchJot1GeneralOfficerDataJson = async (place_id) => {
	const [jot1GeneralOfficer, jot1GeneralOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity, 
		IFNULL(ypno2.officer_id, NULL) or_officer_id,
		IFNULL(ypno2.place_id, NULL) or_officer_place_id,
		IFNULL(officer2.name, NULL) or_officer_name, 
		IFNULL(officer2.image, NULL) or_officer_photo,  
		IFNULL(ypno2.popularity, NULL) or_officer_popularity,
		IFNULL(ypno2.comment, NULL) or_officer_comment,
		IFNULL(ypno2.comment2, NULL) or_officer_comment2, 
		IFNULL(officer2.date_of_birth, NULL) or_officer_age_year, 
		IFNULL(ypno2.officer_direct_age, NULL) or_ypno_officer_direct_age,
		IFNULL(ngo2.name, NULL) or_ngo_name, 
		IFNULL(nspbp2.percent, NULL) or_ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN year_place_ngo_officers ypno2
		ON (
			ypno1.view_order = ypno2.view_order
			AND ypno1.view_order IS NOT NULL
			AND ypno1.year_id = ypno2.year_id
			AND (SELECT ngo_jots_id FROM ngos WHERE id = ypno1.ngo_id) = (SELECT ngo_jots_id FROM ngos WHERE id = ypno2.ngo_id)
			AND ypno1.status = ypno2.status
			AND ypno1.id != ypno2.id
			AND ypno1.place_id = ypno2.place_id
		) LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngo_served_percent_by_palces nspbp2 
		ON (nspbp2.ngo_id = ypno2.ngo_id AND nspbp2.place_id = ypno2.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		LEFT JOIN ngos ngo2
		ON (ypno2.ngo_id = ngo2.id)
		LEFT JOIN officers officer2
		ON (ypno2.officer_id = officer2.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 1 
		AND ypno1.status = 2
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot1GeneralOfficer;
}

const fetchJot2FinalOfficerDataJson = async (place_id) => {
	const [jot2FinalOfficer, jot2FinalOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		WHERE
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 2
		AND ypno1.status = 1 
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot2FinalOfficer;
}
const fetchJot2ChangeOfficerDataJson = async (place_id) => {
	const [jot2ChangeOfficer, jot2ChangeOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity, 
		IFNULL(ypno2.officer_id, NULL) or_officer_id,
		IFNULL(ypno2.place_id, NULL) or_officer_place_id,
		IFNULL(officer2.name, NULL) or_officer_name, 
		IFNULL(officer2.image, NULL) or_officer_photo,  
		IFNULL(ypno2.popularity, NULL) or_officer_popularity,
		IFNULL(ypno2.comment, NULL) or_officer_comment,
		IFNULL(ypno2.comment2, NULL) or_officer_comment2, 
		IFNULL(officer2.date_of_birth, NULL) or_officer_age_year, 
		IFNULL(ypno2.officer_direct_age, NULL) or_ypno_officer_direct_age,
		IFNULL(ngo2.name, NULL) or_ngo_name, 
		IFNULL(nspbp2.percent, NULL) or_ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN year_place_ngo_officers ypno2
		ON (
			ypno1.view_order = ypno2.view_order
			AND ypno1.view_order IS NOT NULL
			AND ypno1.year_id = ypno2.year_id
			AND (SELECT ngo_jots_id FROM ngos WHERE id = ypno1.ngo_id) = (SELECT ngo_jots_id FROM ngos WHERE id = ypno2.ngo_id)
			AND ypno1.status = ypno2.status
			AND ypno1.id != ypno2.id
			AND ypno1.place_id = ypno2.place_id
		) LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngo_served_percent_by_palces nspbp2 
		ON (nspbp2.ngo_id = ypno2.ngo_id AND nspbp2.place_id = ypno2.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		LEFT JOIN ngos ngo2
		ON (ypno2.ngo_id = ngo2.id)
		LEFT JOIN officers officer2
		ON (ypno2.officer_id = officer2.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 2
		AND ypno1.status = 3
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot2ChangeOfficer;
}
const fetchJot2GeneralOfficerDataJson = async (place_id) => {
	const [jot2GeneralOfficer, jot2GeneralOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity, 
		IFNULL(ypno2.officer_id, NULL) or_officer_id,
		IFNULL(ypno2.place_id, NULL) or_officer_place_id,
		IFNULL(officer2.name, NULL) or_officer_name, 
		IFNULL(officer2.image, NULL) or_officer_photo,  
		IFNULL(ypno2.popularity, NULL) or_officer_popularity,
		IFNULL(ypno2.comment, NULL) or_officer_comment,
		IFNULL(ypno2.comment2, NULL) or_officer_comment2, 
		IFNULL(officer2.date_of_birth, NULL) or_officer_age_year, 
		IFNULL(ypno2.officer_direct_age, NULL) or_ypno_officer_direct_age,
		IFNULL(ngo2.name, NULL) or_ngo_name, 
		IFNULL(nspbp2.percent, NULL) or_ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN year_place_ngo_officers ypno2
		ON (
			ypno1.view_order = ypno2.view_order
			AND ypno1.view_order IS NOT NULL
			AND ypno1.year_id = ypno2.year_id
			AND (SELECT ngo_jots_id FROM ngos WHERE id = ypno1.ngo_id) = (SELECT ngo_jots_id FROM ngos WHERE id = ypno2.ngo_id)
			AND ypno1.status = ypno2.status
			AND ypno1.id != ypno2.id
			AND ypno1.place_id = ypno2.place_id
		) LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngo_served_percent_by_palces nspbp2 
		ON (nspbp2.ngo_id = ypno2.ngo_id AND nspbp2.place_id = ypno2.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		LEFT JOIN ngos ngo2
		ON (ypno2.ngo_id = ngo2.id)
		LEFT JOIN officers officer2
		ON (ypno2.officer_id = officer2.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 2
		AND ypno1.status = 2
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot2GeneralOfficer;
}

const fetchJot3FinalOfficerDataJson = async (place_id) => {
	const [jot3FinalOfficer, jot3FinalOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 3
		AND ypno1.status = 1 
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot3FinalOfficer;
}
const fetchJot3ChangeOfficerDataJson = async (place_id) => {
	const [jot3ChangeOfficer, jot3ChangeOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity, 
		IFNULL(ypno2.officer_id, NULL) or_officer_id,
		IFNULL(ypno2.place_id, NULL) or_officer_place_id,
		IFNULL(officer2.name, NULL) or_officer_name, 
		IFNULL(officer2.image, NULL) or_officer_photo,  
		IFNULL(ypno2.popularity, NULL) or_officer_popularity,
		IFNULL(ypno2.comment, NULL) or_officer_comment,
		IFNULL(ypno2.comment2, NULL) or_officer_comment2, 
		IFNULL(officer2.date_of_birth, NULL) or_officer_age_year, 
		IFNULL(ypno2.officer_direct_age, NULL) or_ypno_officer_direct_age,
		IFNULL(ngo2.name, NULL) or_ngo_name, 
		IFNULL(nspbp2.percent, NULL) or_ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN year_place_ngo_officers ypno2
		ON (
			ypno1.view_order = ypno2.view_order
			AND ypno1.view_order IS NOT NULL
			AND ypno1.year_id = ypno2.year_id
			AND (SELECT ngo_jots_id FROM ngos WHERE id = ypno1.ngo_id) = (SELECT ngo_jots_id FROM ngos WHERE id = ypno2.ngo_id)
			AND ypno1.status = ypno2.status
			AND ypno1.id != ypno2.id
			AND ypno1.place_id = ypno2.place_id
		) LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngo_served_percent_by_palces nspbp2 
		ON (nspbp2.ngo_id = ypno2.ngo_id AND nspbp2.place_id = ypno2.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		LEFT JOIN ngos ngo2
		ON (ypno2.ngo_id = ngo2.id)
		LEFT JOIN officers officer2
		ON (ypno2.officer_id = officer2.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 3
		AND ypno1.status = 3
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot3ChangeOfficer;
}
const fetchJot3GeneralOfficerDataJson = async (place_id) => {
	const [jot3GeneralOfficer, jot3GeneralOfficerMeta] = await sequelize.query(
		`SELECT
		IFNULL(ypno1.officer_id, NULL) officer_id,
		IFNULL(ypno1.place_id, NULL) officer_place_id,
		IFNULL(officer1.name, NULL) officer_name, 
		IFNULL(officer1.image, NULL) officer_photo,  
		IFNULL(ypno1.popularity, NULL) officer_popularity,
		IFNULL(ypno1.comment, NULL) officer_comment,
		IFNULL(ypno1.comment2, NULL) officer_comment2, 
		IFNULL(officer1.date_of_birth, NULL) officer_age_year, 
		IFNULL(ypno1.officer_direct_age, NULL) ypno_officer_direct_age,
		IFNULL(ngo1.name, NULL) ngo_name, 
		IFNULL(nspbp1.percent, NULL) ngo_popularity, 
		IFNULL(ypno2.officer_id, NULL) or_officer_id,
		IFNULL(ypno2.place_id, NULL) or_officer_place_id,
		IFNULL(officer2.name, NULL) or_officer_name, 
		IFNULL(officer2.image, NULL) or_officer_photo,  
		IFNULL(ypno2.popularity, NULL) or_officer_popularity,
		IFNULL(ypno2.comment, NULL) or_officer_comment,
		IFNULL(ypno2.comment2, NULL) or_officer_comment2, 
		IFNULL(officer2.date_of_birth, NULL) or_officer_age_year, 
		IFNULL(ypno2.officer_direct_age, NULL) or_ypno_officer_direct_age,
		IFNULL(ngo2.name, NULL) or_ngo_name, 
		IFNULL(nspbp2.percent, NULL) or_ngo_popularity
		FROM year_place_ngo_officers ypno1 LEFT JOIN year_place_ngo_officers ypno2
		ON (
			ypno1.view_order = ypno2.view_order
			AND ypno1.view_order IS NOT NULL
			AND ypno1.year_id = ypno2.year_id
			AND (SELECT ngo_jots_id FROM ngos WHERE id = ypno1.ngo_id) = (SELECT ngo_jots_id FROM ngos WHERE id = ypno2.ngo_id)
			AND ypno1.status = ypno2.status
			AND ypno1.id != ypno2.id
			AND ypno1.place_id = ypno2.place_id
		) LEFT JOIN ngo_served_percent_by_palces nspbp1 
		ON (nspbp1.ngo_id = ypno1.ngo_id AND nspbp1.place_id = ypno1.place_id)
		LEFT JOIN ngo_served_percent_by_palces nspbp2 
		ON (nspbp2.ngo_id = ypno2.ngo_id AND nspbp2.place_id = ypno2.place_id)
		LEFT JOIN ngos ngo1
		ON (ypno1.ngo_id = ngo1.id)
		LEFT JOIN officers officer1
		ON (ypno1.officer_id = officer1.id)
		LEFT JOIN ngos ngo2
		ON (ypno2.ngo_id = ngo2.id)
		LEFT JOIN officers officer2
		ON (ypno2.officer_id = officer2.id)
		WHERE 
		ypno1.place_id = ${place_id}
		AND ngo1.ngo_jots_id = 3
		AND ypno1.status = 2
		AND ypno1.year_id = (SELECT MAX(year_id) FROM year_place_ngo_officers WHERE place_id = ${place_id})
		ORDER BY ypno1.year_id DESC
		LIMIT 1`
	);

	return jot3GeneralOfficer;
}

// Mother Function
exports.combineDetailsReport = async (req, res) => {
	try {

		const id = req.params.id;

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

		const categories = await fetchAllCategoryDataJson(place_id);

		const category = await fetchCategoryDataJson(place_id);

		const type = await fetchTypeDataJson(place_id);

		const jot1Officer = await fetchJot1OfficerDataJson(place_id);

		const jot2Officer = await fetchJot2OfficerDataJson(place_id);

		const ngoPlaceHistory = await fetchNgoPlaceHistoryDataJson(place_id);

		const ngoServedPercentByPlace = await fetchNgoServedPercentByPlaceDataJson(place_id);

		const jotPopularity = await fetchJotPopularityDataJson(place_id);

		const placeCommentWithTitle = await fetchPlaceCommentWithTitleDataJson(place_id);

		const ngoPopularOfficer = await fetchNgoPopularOfficerDataJson(place_id);

		const populationByPlace = await fetchPopulationByPlaceDataJson(place_id);

		const combinedData = {
			place_id: place_id,
			place_name: place_name,
			place_area: place_area,
			categories: categories,
			category: category,
			type: type,
			jot1Officer: jot1Officer,
			jot2Officer: jot2Officer,
			ngoPlaceHistory: ngoPlaceHistory,
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


exports.combineMasterReport = async (req, res) => {
	try {

		const id = req.params.id;

		const [place, metadata] = await sequelize.query(
			`SELECT
			places.id, 
			places.name, 
			places.area
			FROM places
			WHERE id = ${id}`
		);

		const place_id = place.length > 0 ? place[0]['id'] : null;
		const place_name = place.length > 0 ? place[0]['name'] : null;
		const place_area = place.length > 0 ? place[0]['area'] : null;

		const category = await fetchCategoryDataJson(place_id);

		const type = await fetchTypeDataJson(place_id);

		const ngoPopularOfficer = await fetchNgoPopularOfficerDataJson(place_id);

		const jotPopularity = await fetchJotPopularityDataJson(place_id);

		const jot1FinalOfficer = await fetchJot1FinalOfficerDataJson(place_id);

		const jot1ChangeOfficer = await fetchJot1ChangeOfficerDataJson(place_id);

		const jot1GeneralOfficer = await fetchJot1GeneralOfficerDataJson(place_id);

		const jot2FinalOfficer = await fetchJot2FinalOfficerDataJson(place_id);

		const jot2ChangeOfficer = await fetchJot2ChangeOfficerDataJson(place_id);

		const jot2GeneralOfficer = await fetchJot2GeneralOfficerDataJson(place_id);

		const jot3FinalOfficer = await fetchJot3FinalOfficerDataJson(place_id);

		const jot3ChangeOfficer = await fetchJot3ChangeOfficerDataJson(place_id);

		const jot3GeneralOfficer = await fetchJot3GeneralOfficerDataJson(place_id);

		const combinedData = {
			place_id: place_id,
			place_name: place_name,
			place_area: place_area,
			category: category,
			type: type,
			jot1FinalOfficer: jot1FinalOfficer,
			jot1ChangeOfficer: jot1ChangeOfficer,
			jot1GeneralOfficer: jot1GeneralOfficer,
			jot2FinalOfficer: jot2FinalOfficer,
			jot2ChangeOfficer: jot2ChangeOfficer,
			jot2GeneralOfficer: jot2GeneralOfficer,
			jot3FinalOfficer: jot3FinalOfficer,
			jot3ChangeOfficer: jot3ChangeOfficer,
			jot3GeneralOfficer: jot3GeneralOfficer,
			ngoPopularOfficer: ngoPopularOfficer,
			jotPopularity: jotPopularity,
		}

		// Update the Place table with the combined data

		return apiResponse.successResponseWithData(
			res,
			'all_data fetch successfully.',
			combinedData)
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}

exports.createChildJson = async (id, objectName) => {
	try {
		const mainObject = await sequelize.models.Place.findByPk(id);
		if (!mainObject) {
			throw new Error(`Place with ID ${id} not found.`);
		}

		let updatedJson = mainObject.updated_json ? JSON.parse(mainObject.updated_json) : {};

		if (objectName === "ngoServedPercentByPlace") {
			const ngoServedPercentByPlace = await fetchNgoServedPercentByPlaceDataJson(id);
			updatedJson.ngoServedPercentByPlace = ngoServedPercentByPlace;
		} else if (objectName === "placeCommentWithTitle") {
			const placeCommentWithTitle = await fetchPlaceCommentWithTitleDataJson(id);
			updatedJson.placeCommentWithTitle = placeCommentWithTitle;
		} else if (objectName === "populationByPlace") {
			const populationByPlace = await fetchPopulationByPlaceDataJson(id);
			updatedJson.populationByPlace = populationByPlace;
		} else if (
			objectName[0] === "ngoPopularOfficer" &&
			objectName[1] === "jot1Officer" &&
			objectName[2] === "jot2Officer" &&
			objectName[3] === "ngoPlaceHistory"
		) {
			const ngoPopularOfficer = await fetchNgoPopularOfficerDataJson(id);
			const jot1Officer = await fetchJot1OfficerDataJson(id);
			const jot2Officer = await fetchJot2OfficerDataJson(id);
			const ngoPlaceHistory = await fetchNgoPlaceHistoryDataJson(id);

			updatedJson.ngoPopularOfficer = ngoPopularOfficer;
			updatedJson.jot1Officer = jot1Officer;
			updatedJson.jot2Officer = jot2Officer;
			updatedJson.ngoPlaceHistory = ngoPlaceHistory;
		} else if (objectName[0] === "type" && objectName[1] === "category") {
			const category = await fetchCategoryDataJson(id);
			const type = await fetchTypeDataJson(id);
			updatedJson.category = category;
			updatedJson.type = type;
		}

		// Convert the JSON object back to a JSON string before storing
		mainObject.updated_json = updatedJson;

		// Update and save the Place model
		updatePlaceQueue.add({ placeId: id, updatedData: updatedJson });

		console.log("updatedJson", updatedJson)


		return true;
	} catch (error) {
		console.error('Error creating child JSON:', error);
		return false;
	}
};

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

		const data = place_data.map(entry => entry.updated_json);
		//console.log('updatedJsonValues',updatedJsonValues);
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			data
		);
	} catch (err) {
		console.log("---------------------error getPlaceDetailsAllMongo--------------------");
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getPlaceDetailsAllMongoCounter = async (req, res) => {
	try {
		// const page = parseInt(req.body.page) + 1; // Get the current page from the request query or default to page 1
		// const pageSize = parseInt(req.body.pageSize) || 10; // Get the page size from the request query or default to 10
		// const offset = (page - 1) * pageSize; // Calculate the offset
		let placeIds;
		// const yearRow = await years.findOne({
		// 	order: [['name', 'DESC']],
		// });
		console.log("---------------------inside getPlaceDetailsAllMongo counter--------------------");
		console.log(req.body);
		// let year = yearRow.id;

		let query = [];



		if (
			req.body.division_id !== '' &&
			req.body.district_id !== '' &&
			req.body.place_id !== ''
		) {
			query.push({ id: req.body.place_id });
		}

		if (req.body.division_id !== '') {
			console.log('divisionid');
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: req.body.division_id,
				},
				//limit: pageSize, // Limit the number of results per page
				//offset: offset, // Skip the appropriate number of rows based on the current page
			});
			placeIds = places.map((place) => place.id);

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
			console.log('placeIds------------------', placeIds);
		}



		const placeDataAndCount = await Place.findAndCountAll({
			attributes: ['updated_json'],
			where: query,
		});

		const placeData = placeDataAndCount.rows; // The actual data
		const resultCount = placeDataAndCount.count; // The count of results


		console.log('length', resultCount);
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			{
				total_place_count: resultCount ? resultCount : null, // Your additional data (you can replace 42 with the desired value)
			}
		);
	} catch (err) {
		console.log("---------------------error getPlaceDetailsAllMongoCounter--------------------");
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getPlaceDetailsByIdMongo = async (req, res) => {
	try {
		const place_data = await Place.findOne({
			attributes: ['updated_json'],
			where: { id: req.params.id },
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