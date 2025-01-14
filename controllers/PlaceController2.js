const { model } = require('mongoose');
const apiResponse = require('../helpers/apiResponse');
const checkUserRoleByPlace = require('./globalController');
const {
	ngoServedPercentByPlace,
	ngoJotAddIntoPlace,
} = require('../validator/place');

const {
	years,
	Place,
	Sub_place,
	Upazilla,
	Union,
	ngo_jots,
	Division,
	District,
	ngo_categories,
	ngo_category_b,
	ngo_served_percent_by_palces,
	ngo_jot_add_into_places,
	year_place_ngo_officer,
	Ngo,
	Officer,
	sequelize,
} = require('../models');
const { where } = require('sequelize');
var Sequelize = require('sequelize');

exports.getPlaceList = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		}
		// console.log(arr)
		const place_data = await Place.findAll({
			order: [['id', 'ASC']],
			where: arr,
		});
		if (place_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Place table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getallPlace = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		}
		// console.log(arr)
		const place_data = await Place.findAll({
			include: [Division, District],
			order: [['id', 'ASC']],
			where: arr,
		});
		if (place_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Place table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.getallDivision = async (req, res) => {
	try {
		const division_data = await Division.findAll();
		if (division_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				division_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Division table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.getallDivision = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const roleByplace = await checkUserRoleByPlace(token);

		const divisionIds = roleByplace.division; // Get the division IDs from the user's role

		let division_data;

		if (divisionIds.length > 0) {
			division_data = await Division.findAll({
				where: { id: divisionIds }, // Fetch divisions that match the IDs in the user's role
			});
		} else {
			division_data = await Division.findAll(); // Fetch all divisions if no division IDs are set in the user's role
		}

		if (division_data && division_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				division_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No divisions found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getDivision = async (req, res) => {
	try {
		const division_data = await Division.findByPk(req.params.id);
		if (division_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				division_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Division table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getDistrict = async (req, res) => {
	try {
		const district_data = await District.findByPk(req.params.id);
		if (district_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				district_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'District table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getallDistrict = async (req, res) => {
	try {
		const district_data = await District.findAll({
			include: [Division],
		});
		if (district_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				district_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'District table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createPlace = async (req, res) => {
	try {
		if (
			req.body.name &&
			req.body.area &&
			req.body.district_id &&
			req.body.division_id
		) {
			const if_place_exists = await Place.findOne({
				where: { name: req.body.name },
			});
			if (if_place_exists) {
				return apiResponse.ErrorResponse(
					res,
					'Place already found in database.'
				);
			} else {
				await Place.create(req.body);
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(
				res,
				'name/area/district_id/division_id is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteplacebyid = async (req, res) => {
	try {
		const place_id = req.params.id;
		const place_data = await Place.findOne({ where: { id: place_id } });
		if (place_data) {
			await Place.destroy({ where: { id: place_id } });
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updatePlace = async (req, res) => {
	try {
		const place_id = req.params.id;
		if (
			req.body.name &&
			req.body.area &&
			req.body.district_id &&
			req.body.division_id
		) {
			const if_place_exists = await Place.findOne({ where: { id: place_id } });
			if (if_place_exists) {
				await Place.update(req.body, { where: { id: place_id } });
				return apiResponse.successResponse(res, 'Data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'No matching data found.');
			}
		} else {
			return apiResponse.ErrorResponse(
				res,
				'name/area/district_id/division_id is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getDistrictmap = async (req, res) => {
	try {
		const id = req.params.id;
		const district_data = await District.findOne({
			where: { id: req.params.id },
		});
		if (district_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				district_data
			);
		} else {
			return apiResponse.ErrorResponse(
				res,
				'getDistrictmap District table is empty.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getDivisionmap = async (req, res) => {
	try {
		const id = req.params.id;
		const division_data = await Division.findOne({ where: { id: id } });
		if (division_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				division_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Division table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.getDistrictByDivision = async (req, res) => {
	try {
		const id = req.params.id;
		const district_data = await District.findAll({
			where: { division_id: id },
		});
		if (district_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				district_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'District table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.getDistrictByDivision = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const roleByplace = await checkUserRoleByPlace(token);

		const permittedDistrictIds = roleByplace.district; // Get the permitted district IDs from the user's role

		let district_data;

		if (permittedDistrictIds.length > 0) {
			district_data = await District.findAll({
				where: { division_id: id, id: permittedDistrictIds }, // Fetch districts that match the provided division ID and the permitted district IDs
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

// Select a.ID, a.Name, b.ID as Boss, b.Name as BossName
// from Employees A
// left join Employees B
// on a.Boss = b.ID
exports.getPlacesByDivision = async (req, res) => {
	try {
		const id = req.params.id;
		const [results, metadata] = await sequelize.query(
			`select 
  places.id as place_id,
  places.name as place_name,
  places.ngo_id as place_ngo_id,
  places.area as place_area,
  ngos.name as ngo_name,
  ngo_categories.color_code as category_color, 
  ngo_categories.short_name as category_short_name, 
  ngo_categories.type as category_type,
  cat_type.type as type_type,
  cat_type.short_name as type_short_name,
  cat_type.name as type_name  
from 
  places
  LEFT JOIN ngos on ngos.id = places.ngo_id
  LEFT JOIN ngo_category_bs on ngo_category_bs.place_id = places.id 
  LEFT JOIN ngo_categories on ngo_category_bs.ngo_category_id = ngo_categories.id 
  LEFT JOIN ngo_categories cat_type on ngo_category_bs.ngo_category_type_id = cat_type.id 
where 
  places.division_id = ${id} 
GROUP BY 
  places.id`
		);
		if (results) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'District table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getPlacesByDistrict = async (req, res) => {
	try {
		const id = req.params.id;
		const [results, metadata] = await sequelize.query(
			`select 
  places.id as place_id, 
  places.name as place_name, 
  places.ngo_id as place_ngo_id, 
  places.area as place_area, 
  ngos.name as ngo_name,
  ngo_categories.color_code as category_color, 
  ngo_categories.short_name as category_short_name,
  ngo_categories.type as category_type,
  cat_type.type as type_type,
  cat_type.short_name as type_short_name,
  cat_type.name as type_name  
from 
  places
  LEFT JOIN ngos on ngos.id = places.ngo_id
  LEFT JOIN ngo_category_bs on ngo_category_bs.place_id = places.id 
  LEFT JOIN ngo_categories on ngo_category_bs.ngo_category_id = ngo_categories.id 
  LEFT JOIN ngo_categories cat_type on ngo_category_bs.ngo_category_type_id = cat_type.id 
where 
  places.district_id = ${id} 
GROUP BY 
  places.id`
		);
		if (results) {
			console.log(results);
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'District table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.placeConnectWithNgo = async (req, res) => {
	try {
		const data = req.body;
		// for (i = 0; i < data.ngo_id.length; i++) {
		await Place.update(
			{
				ngo_id: data.ngo_id.value,
			},
			{ where: { id: data.place_id } }
		);
		// }
		return apiResponse.successResponse(res, 'Data successfully updated.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.addCategoryB = async (req, res) => {
// 	try {
// 		ngo_category_b.destroy({ where: { place_id: req.body.place_id } });
// 		if (req.body.place_id && req.body.datas) {
// 			for (let index = 0; index < req.body.datas.length; index++) {
// 				const element = req.body.datas[index];
// 				element.place_id = req.body.place_id;
// 				await ngo_category_b.create(element);
// 			}
// 			return apiResponse.successResponse(res, 'Data successfully saved.');
// 		} else {
// 			return apiResponse.ErrorResponse(
// 				res,
// 				'name/place_id/short_name/name/color_code is missing.'
// 			);
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

/*
exports.addCategoryB = async (req, res) => {
	try {
		// Check if data already exists
		const existingData = await ngo_category_b.findOne({
			where: { 
				place_id: req.body.place_id
			},
		});

		if (req.body.place_id && req.body.datas) {
			for (let index = 0; index < req.body.datas.length; index++) {
				const element = req.body.datas[index];
				element.place_id = req.body.place_id;

				if (existingData) {
					// Update existing data
					await ngo_category_b.update(element, {
						where: {
							place_id: req.body.place_id,
							ngo_category_id: element.ngo_category_id,
						},
					});
				} else {
					// Create new data
					await ngo_category_b.create(element);
				}
			}

			console.log('==================>', req.body.datas);

			
			return apiResponse.successResponse(res, 'Data successfully saved.');
		} else {
			return apiResponse.ErrorResponse(
				res,
				'name/place_id/short_name/name/color_code is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.addCategoryB = async (req, res) => {
	try {
		// Check if data already exists
		const existingData = await ngo_category_b.findOne({
			where: {
				place_id: req.body.place_id,
			},
		});

		if (req.body.place_id && req.body.datas) {
			// Define allowed ngo_category_id values
			const allowedNgoCategoryIds = req.body.ngo_category_id || [];

			for (let index = 0; index < req.body.datas.length; index++) {
				const element = req.body.datas[index];

				// Insert or update record only if ngo_category_id is allowed
				if (
					element &&
					allowedNgoCategoryIds.includes(element.ngo_category_id)
				) {
					element.place_id = req.body.place_id;

					if (existingData) {
						// Update existing data
						await ngo_category_b.update(element, {
							where: {
								place_id: req.body.place_id,
								ngo_category_id: element.ngo_category_id,
							},
						});
					} else {
						// Create new data
						await ngo_category_b.create(element);
					}
				}
			}

			console.log('==================>', req.body.datas);

			return apiResponse.successResponse(res, 'Data successfully saved.');
		} else {
			return apiResponse.ErrorResponse(
				res,
				'place_id or ngo_category_id is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.placeDetails = async (req, res) => {
// 	try {
// 		const yearRow = await years.findOne({
// 			order: [['name', 'DESC']],
// 		});

// 		let year = yearRow.id;
// 		const place_id = req.params.id;
// 		const place_data = await Place.findOne({
// 			where: { id: place_id },
// 			include: [
// 				{
// 					model: ngo_category_b,
// 					as: 'categoryB',
// 				},
// 				{
// 					model: ngo_served_percent_by_palces,
// 					as: 'ngoServedPercentByPalce',
// 					include: [
// 						{
// 							model: Ngo,
// 							as: 'ngo',
// 						},
// 					],
// 				},
// 				{
// 					model: year_place_ngo_officer,
// 					as: 'year_place_ngo_officer',
// 					where: {
// 						year_id: year,
// 						rank: 1,
// 					},
// 					required: false,
// 					include: [Officer, Ngo, years],
// 				},
// 			],
// 		});

// 		return apiResponse.successResponseWithData(
// 			res,
// 			'Data successfully fetched.',
// 			place_data
// 		);
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };
//
//					include: [{model:ngo_categories}]
// include: [
// 	{
// 		model:ngo_categories,
// 		as: 'category',
// 		where: {
// 			ngo_categories.id: ngo_category_b.ngo_category_id,
// 		}
// 	}
// ]

exports.placeDetails = async (req, res) => {
	try {
		const yearRow = await years.findOne({
			order: [['name', 'DESC']],
		});

		let year = yearRow.id;
		const place_id = req.params.id;
		const place_data = await Place.findOne({
			where: { id: place_id },
			include: [
				{
					model: ngo_category_b,
					as: 'categoryB',
					include: [
						{
							model: ngo_categories,
							as: 'category',
						},
						{
							model: ngo_categories,
							as: 'type',
						},
					],
				},
				{
					model: ngo_served_percent_by_palces,
					as: 'ngoServedPercentByPalce',
					include: [
						{
							model: Ngo,
							as: 'ngo',
						},
					],
					order: [
						Sequelize.fn('isnull', Sequelize.col('view_orders')),
						['ngo', 'view_order', 'ASC'],
					],
				},
				{
					model: year_place_ngo_officer,
					as: 'year_place_ngo_officer',
					where: {
						year_id: year,
						rank: 1,
					},
					required: false,
					include: [Officer, Ngo, years],
				},
			],
		});

		//Modify the ngoServedPercentByPalce array to order by ngo_id in ascending order
		if (place_data?.ngoServedPercentByPalce) {
			place_data.ngoServedPercentByPalce =
				place_data?.ngoServedPercentByPalce.sort((a, b) => {
					if (
						a.ngo?.view_order < b.ngo?.view_order &&
						a.ngo?.view_order !== null &&
						b.ngo?.view_order !== null
					) {
						// console.log('if');
						// console.log(a.ngo?.name+'-'+a.ngo?.view_order);
						// console.log(b.ngo?.name+'-'+b.ngo?.view_order);
						return -1;
					} else if (
						a.ngo?.view_order > b.ngo?.view_order &&
						a.ngo?.view_order !== null &&
						b.ngo?.view_order !== null
					) {
						// console.log('else if');
						// console.log(a.ngo?.name+'-'+a.ngo?.view_order);
						// console.log(b.ngo?.name+'-'+b.ngo?.view_order);
						return 1;
					} else {
						// console.log('else');
						// console.log(a.ngo?.name+'-'+a.ngo?.view_order);
						// console.log(b.ngo?.name+'-'+b.ngo?.view_order);
						if (a.ngo?.view_order == null) return 1;
						if (b.ngo?.view_order == null) return -1;
					}
				});
		}
		console.log('----------jkafdf------------------------------');
		console.log(place_data);
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.placeDetailsAll = async (req, res) => {
	const d = new Date();
	let year = d.getFullYear();
	// const place_id = req.params.id
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let whereCondition = {};

		if (roleByplace.district.length > 0) {
			whereCondition.district_id = roleByplace.district;
		}
		if (roleByplace.division.length > 0) {
			whereCondition.division_id = roleByplace.division;
		}
		if (roleByplace.place.length > 0) {
			whereCondition.place_id = roleByplace.place;
		}
		const place_data = await ngo_served_percent_by_palces.findAll({
			group: 'place_id',
			include: [
				{
					model: Place,
				},
				{
					model: Ngo,
					as: 'ngo',
				},
				{
					model: Division,
				},
			],
			where: whereCondition,
		});
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.placeHistory = async (req, res) => {
	const place_id = req.params.id;
	try {
		console.log('---------------hiimhere');
		const place_data = await sequelize.query(

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
			pyp.served_population as total_served_population
			FROM year_place_ngo_officers ypno
				LEFT JOIN years on years.id = ypno.year_id
				LEFT JOIN places on places.id = ypno.place_id
				LEFT JOIN ngos on ngos.id = ypno.ngo_id
				LEFT JOIN officers on officers.id = ypno.officer_id
				LEFT JOIN population_year_places as pyp on ypno.year_id = pyp.year_id AND ypno.place_id = pyp.place_id
			WHERE
				places.id = ` +
				place_id +
				`
			AND ypno.rank IN (1, 2)
			ORDER BY
			years.id desc, ypno.rank ASC;`,
			{ type: sequelize.QueryTypes.SELECT }
		);
		// AND ypno.rank IS NOT NULL
		// 		AND ypno.rank <> 0
		console.log('---------------imhere');
		console.log(place_data);
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.AllPlaceHistory = async (req, res) => {
	const place_id = req.params.id;
	try {
		//'SELECT GROUP_CONCAT(DISTINCT(ngo_id)) as ngoID,GROUP_CONCAT(DISTINCT(ngos.name) ORDER BY ngos.id ASC) as ngo_list,GROUP_CONCAT(DISTINCT(ngos.short_name)) as ngo_short_name,GROUP_CONCAT(DISTINCT(ngos.color_code) ORDER BY ngos.id ASC) as color_list,years.name as year_id,years.bn_term as term,(SELECT GROUP_CONCAT(cnt) cnt FROM ( SELECT COUNT(*) cnt,year_id FROM year_place_ngo_officers ypno where rank=1 GROUP BY ypno.ngo_id,year_id )as totla WHERE totla.year_id = year_place_ngo_officers.year_id) as percent_list FROM `year_place_ngo_officers` LEFT join ngos on ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN years on year_place_ngo_officers.year_id = years.id where rank=1 AND years.type=0 GROUP by year_id order by year_place_ngo_officers.year_id desc',
		const place_data = await year_place_ngo_officer.sequelize.query(
			// `SELECT ypno_year_id, GROUP_CONCAT( ypno_ngo_id ORDER BY ngo_id ASC ) AS ngoID, GROUP_CONCAT( ngo_name ORDER BY ngo_id ASC ) AS ngo_list, GROUP_CONCAT( ngo_short_name ORDER BY ngo_id ASC ) AS ngo_short_name, GROUP_CONCAT( ngo_color_code ORDER BY ngo_id ASC ) AS color_list, year_name, year_bn_name, year_bn_term, year_type, GROUP_CONCAT( ngoRank1Counter ORDER BY ngo_id ASC ) AS percent_list FROM ( SELECT ypno.year_id as ypno_year_id, ypno.ngo_id as ypno_ngo_id, ngos.id as ngo_id, ngos.name as ngo_name, ngos.short_name as ngo_short_name, ngos.color_code as ngo_color_code, years.name as year_name, years.bn_name as year_bn_name, years.bn_term as year_bn_term, years.type as year_type, COUNT(*) AS ngoRank1Counter FROM year_place_ngo_officers ypno LEFT JOIN ngos on ngos.id = ypno.ngo_id LEFT JOIN years on years.id = ypno.year_id WHERE rank = 1 AND years.type = 0 GROUP BY year_id, ypno_ngo_id ORDER BY ngo_id ASC -- Add an ORDER BY clause here ) AS subquery GROUP BY ypno_year_id ORDER BY ypno_year_id DESC;`,
			`SELECT 
  ngo_id, 
  ngos.name as ngo_name, 
  ngos.short_name, 
  ngos.color_code, 
  years.name, 
  years.id as year_id, 
  years.bn_term, 
  years.type as year_type, 
  COUNT(ngo_id) as percent 
FROM 
  year_place_ngo_officers 
  LEFT JOIN ngos ON(
    ngos.id = year_place_ngo_officers.ngo_id
  ) 
  LEFT JOIN years ON(
    years.id = year_place_ngo_officers.year_id
  ) 
WHERE 
  year_place_ngo_officers.rank = 1 
  AND years.type = 0 
GROUP BY 
  year_place_ngo_officers.ngo_id, 
  year_place_ngo_officers.year_id 
ORDER BY 
  year_place_ngo_officers.year_id DESC;
`,
			{ type: year_place_ngo_officer.sequelize.QueryTypes.SELECT }
		);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.placeHistoryDistrict = async (req, res) => {
	const dis_id = req.params.id;
	try {
		//`SELECT GROUP_CONCAT(DISTINCT(year_place_ngo_officers.ngo_id)) as ngoID,GROUP_CONCAT(DISTINCT(ngos.name) order by ngos.id asc) as ngo_list,GROUP_CONCAT(DISTINCT(ngos.short_name)) as ngo_short_name,GROUP_CONCAT(DISTINCT(ngos.color_code) order by ngos.id asc) as color_list,years.name as year_id,years.bn_term as term,(SELECT GROUP_CONCAT(cnt) cnt FROM ( SELECT COUNT(*) cnt,year_id,place_id  FROM year_place_ngo_officers ypno left join places on places.id = ypno.place_id left join districts on districts.id = places.district_id where rank=1 and district_id=${dis_id} GROUP BY ypno.ngo_id,year_id )as totla WHERE totla.year_id = year_place_ngo_officers.year_id ) as percent_list FROM year_place_ngo_officers LEFT join ngos on ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN years on year_place_ngo_officers.year_id = years.id left join places on places.id = year_place_ngo_officers.place_id left join districts on districts.id = places.district_id where rank=1 and district_id=${dis_id}  GROUP by year_id DESC`
		const [results, metadata] = await year_place_ngo_officer.sequelize.query(
			`SELECT 
  ypno.ngo_id, 
  ngos.name AS ngo_name, 
  ngos.short_name, 
  ngos.color_code, 
  years.name, 
  years.name as year_bn_name,
  years.id AS year_id, 
  years.bn_term, 
  years.type AS year_type, 
  COUNT(ypno.ngo_id) AS percent 
FROM 
  year_place_ngo_officers ypno
  LEFT JOIN ngos ON ngos.id = ypno.ngo_id
  LEFT JOIN years ON years.id = ypno.year_id
  LEFT JOIN places ON places.id = ypno.place_id
WHERE 
  ypno.rank = 1 
  AND places.district_id=${dis_id}
GROUP BY 
  ypno.ngo_id, 
  ypno.year_id 
ORDER BY 
  ypno.year_id DESC;`
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

exports.placeHistoryDivision = async (req, res) => {
	const dis_id = req.params.id;
	try {
		const [results, metadata] = await year_place_ngo_officer.sequelize
			.query(`SELECT 
  ypno.ngo_id, 
  ngos.name AS ngo_name, 
  ngos.short_name, 
  ngos.color_code, 
  years.name, 
  years.name as year_bn_name,
  years.id AS year_id, 
  years.bn_term, 
  years.type AS year_type, 
  COUNT(ypno.ngo_id) AS percent 
FROM 
  year_place_ngo_officers ypno
  LEFT JOIN ngos ON ngos.id = ypno.ngo_id
  LEFT JOIN years ON years.id = ypno.year_id
  LEFT JOIN places ON places.id = ypno.place_id
WHERE 
  ypno.rank = 1 
  AND years.type = 0 
  AND places.division_id=${dis_id}
GROUP BY 
  ypno.ngo_id, 
  ypno.year_id 
ORDER BY 
  ypno.year_id DESC`);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			results
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
{
	/*
exports.addNgoServedPercent = async (req, res) => {
	try {
		// await ngoServedPercentByPlace.validateAsync({
		//     ngo_id: req.body.ngo_id,
		//     district_id: req.body.district_id,
		//     division_id: req.body.division_id,
		//     place_id: req.body.place_id,
		//     percent: req.body.percent,
		// })
		let ngo_id = req.body.ngo_id;
		for (i = 0; i < ngo_id.length; i++) {
			await ngo_served_percent_by_palces.destroy({
				where: {
					// place_id: req.body.place_id,
					// ngo_id: ngo_id[i].id,
					percent: null
				},
			});
			req.body.ngo_id = ngo_id[i].id;
			req.body.percent = ngo_id[i]?.ngo_served_percent_by_palce?.percent;
			await ngo_served_percent_by_palces.create(req.body);
		}

		// await ngo_served_percent_by_palces.destroy({
		//     where: {
		//         place_id: req.body.place_id,
		//         ngo_id: req.body.ngo_id,
		//     }
		// });
		// await ngo_served_percent_by_palces.create(req.body);
		return apiResponse.successResponse(res, 'Data successfully saved.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/
}
exports.addNgoServedPercent = async (req, res) => {
	try {
		console.log(req.body.ngos);
		let ngos = req.body.ngos;
		for (i = 0; i < ngos.length; i++) {
			// find the existing record by ngo_id and place_id
			let existingRecord = await ngo_served_percent_by_palces.findOne({
				where: {
					id: ngos[i].ngoServedPercentByPlaceId,
					place_id: ngos[i].placeid,
					ngo_id: ngos[i].id,
				},
			});

			// if the record exists, update the percent value
			if (existingRecord) {
				if (
					ngos[i].percent === 0 ||
					ngos[i].percent === null ||
					ngos[i].percent === ''
				) {
					await existingRecord.destroy();
				} else {
					existingRecord.percent = ngos[i].percent;
					await existingRecord.save();
				}
			} else {
				if (ngos[i].percent !== null) {
					await ngo_served_percent_by_palces.create({
						place_id: req.body.place_id,
						ngo_id: ngos[i].id,
						district_id: req.body.district_id,
						division_id: req.body.division_id,
						percent: ngos[i].percent,
					});
				}
			}
		}

		return apiResponse.successResponse(
			res,
			'addNgoServedPercent - Data successfully saved.'
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createPlaceCategoryType = async (req, res) => {
	try {
		if (req.body.place_id) {
			const existData = await ngo_category_b.findOne({
				where: { place_id: req.body.place_id },
			});

			if (existData) {
				return apiResponse.ErrorResponse(
					res,
					'ngo_category_b already found in database.'
				);
			} else {
				await ngo_category_b.create(req.body);
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'ngo_category_b missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updatePlaceCategoryType = async (req, res) => {
	try {
		if (req.body.place_id) {
			const existData = await ngo_category_b.findOne({
				where: { place_id: req.body.place_id },
			});

			if (existData) {
				await ngo_category_b.update(req.body, {
					where: { place_id: req.body.place_id },
				});
				return apiResponse.successResponse(res, 'Data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'No matching data found.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'ngo_category_b missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.getPlaceCategoryType = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			`SELECT ngo_category_bs.id as id, (SELECT name FROM ngo_categories WHERE type=1 AND id=ngo_category_bs.ngo_category_id) as categoryname, (SELECT name FROM ngo_categories WHERE type=0 AND id=ngo_category_bs.ngo_category_type_id) as typename, places.name as place_name, places.id as placeid, places.district_id as districtid, places.division_id as divisionid FROM ngo_category_bs INNER JOIN places on ngo_category_bs.place_id = places.id LEFT JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id;`
		);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.getPlaceCategoryType = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		let whereClause = ''; // Initialize an empty string for the WHERE clause

		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ place_id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		}

		// Generate the WHERE clause based on the conditions
		if (arr.length > 0) {
			const placeIds = arr.map((obj) => obj.place_id);
			whereClause = `WHERE places.id IN (${placeIds.join(',')})`;
		}

		const query = `
			SELECT
					ngo_category_bs.id AS id,
					(SELECT name FROM ngo_categories WHERE type = 1 AND id = ngo_category_bs.ngo_category_id) AS categoryname,
					(SELECT name FROM ngo_categories WHERE type = 0 AND id = ngo_category_bs.ngo_category_type_id) AS typename,
					places.name AS place_name,
					places.id AS placeid,
					places.district_id AS districtid,
					places.division_id AS divisionid
			FROM
					ngo_category_bs
					INNER JOIN places ON ngo_category_bs.place_id = places.id
					LEFT JOIN ngo_categories ON ngo_categories.id = ngo_category_bs.ngo_category_id
			${whereClause}`; // Add the WHERE clause to the query

		const [results, metadata] = await sequelize.query(query);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successful.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deletePlaceCategoryType = async (req, res) => {
	try {
		const id = req.params.id;
		const existData = await ngo_category_b.findOne({
			where: { id: id },
		});
		if (existData) {
			await ngo_category_b.destroy({
				where: { id: id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getNgoServedPercent = async (req, res) => {
	const place_id = req.params.id;
	try {
		const place_data = await ngo_served_percent_by_palces.findAll({
			// include:[Place,Ngo,Division,District],
			include: [
				{
					model: Ngo,
					as: 'ngo',
				},
				{
					model: Place,
				},
				{
					model: Division,
				},
			],
			where: { place_id },
		});
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
// exports.ngoJotAddIntoPlace = async(req, res)=>{
//     try{
//         await ngoJotAddIntoPlace.validateAsync({
//             ngo_jot_id: req.body.ngo_jot_id,
//             district_id: req.body.district_id,
//             division_id: req.body.division_id,
//             place_id: req.body.place_id,
//             percent: req.body.percent,
//         })

//         await ngo_jot_add_into_places.destroy({
//             where: {
//                 place_id: req.body.place_id,
//                 ngo_jot_id: req.body.ngo_jot_id,
//             }
//         });
//         await ngo_jot_add_into_places.create(req.body);
//         return apiResponse.successResponse(res, "Data successfully saved.")
//     } catch (err) {
//         return apiResponse.ErrorResponse(res, err.message)
//     }
// }

// exports.ngoJotAddIntoPlace = async (req, res) => {
// 	try {
// 		let prev_state = req.body.ngo_jot_id;
// 		for (i = 0; i < prev_state.length; i++) {
// 			await ngo_jot_add_into_places.destroy({
// 				where: {
// 					place_id: req.body.place_id,
// 					ngo_jot_id: prev_state[i].id,
// 				},
// 			});

// 			req.body.ngo_jot_id = prev_state[i].id;
// 			if (prev_state[i]?.percent) {
// 				req.body.percent = prev_state[i]?.percent;
// 			} else {
// 				req.body.percent = 0;
// 			}
// 			await ngo_jot_add_into_places.create(req.body);
// 		}
// 		// await ngo_jot_add_into_places.create(req.body);
// 		return apiResponse.successResponse(res, 'Data successfully saved.');
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.ngoJotAddIntoPlace = async (req, res) => {
	try {
		let prev_state = req.body.ngo_jot_id;
		for (i = 0; i < prev_state.length; i++) {
			// find the existing record by ngo_id and place_id
			let existingRecord = await ngo_jot_add_into_places.findOne({
				where: {
					place_id: req.body.place_id,
					ngo_jot_id: prev_state[i].id,
				},
			});

			// if the record exists, update the percent value
			if (existingRecord) {
				existingRecord.percent =
					prev_state[i]?.percent || existingRecord.percent;

				if (
					existingRecord.percent == 0 ||
					existingRecord.percent == null ||
					existingRecord.percent === ''
				) {
					await existingRecord.destroy({
						where: {
							id: req.body.id,
						},
					});
				} else {
					await existingRecord.save();
				}
			}
			// if the record does not exist, create a new record
			else {
				await ngo_jot_add_into_places.create({
					place_id: req.body.place_id,
					ngo_jot_id: prev_state[i].id,
					district_id: req.body.district_id,
					division_id: req.body.division_id,
					percent: prev_state[i].percent,
				});
			}
		}

		// await ngo_jot_add_into_places.create(req.body);
		return apiResponse.successResponse(res, 'Data successfully saved.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.allNgoJotAddIntoPlace = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let whereCondition = {};

		if (roleByplace.district.length > 0) {
			whereCondition.district_id = roleByplace.district;
		}
		if (roleByplace.division.length > 0) {
			whereCondition.division_id = roleByplace.division;
		}
		if (roleByplace.place.length > 0) {
			whereCondition.place_id = roleByplace.place;
		}
		const place_data = await ngo_jot_add_into_places.findAll({
			include: [Place, ngo_jots, Division, District],
			group: 'place_id',
			where: whereCondition,
		});
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getNgoJotAddIntoPlaceId = async (req, res) => {
	const place_id = req.params.id;
	try {
		const place_data = await ngo_jot_add_into_places.findAll({
			include: [Place, ngo_jots, Division, District],
			where: { place_id },
		});
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getNgoJotById = async (req, res) => {
	const id = req.params.id;
	try {
		const place_data = await ngo_jot_add_into_places.findByPk(id, {
			include: [Place, ngo_jots, Division, District],
		});
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			place_data
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.ngoJotDeleteById = async (req, res) => {
	const id = req.params.id;
	try {
		await ngo_jot_add_into_places.destroy({ where: { id } });
		return apiResponse.successResponse(res, 'Data successfully deleted.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.categoryAlist = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			//`select ngos.id as id , places.name as name, ngos.name as ngoname, ngos.color_code as color_code, ngos.short_name as short_name  from ngos INNER JOIN places on ngos.id = places.ngo_id`
			`select 
  ngos.id as id, 
  places.name as name,
  places.district_id as districtid,
  places.division_id as divsionid,
  ngos.name as ngoname, 
  ngos.color_code as color_code, 
  ngos.short_name as short_name 
from 
  ngos 
  INNER JOIN places on ngos.id = places.ngo_id`
		);

		if (results.length > 0) {
			{
				//console.log(results);
			}
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.categoryBlist = async (req, res) => {
	try {
		const [results, metadata] =
			await sequelize.query(`select ngo_category_bs.id as id , ngo_categories.name as categoryname , places.name as name, places.id as placeid , places.district_id as districtid , places.division_id as divisionid,
        ngo_categories.short_name as categoryShortName, ngo_categories.color_code as color_code  from ngo_category_bs INNER JOIN places on ngo_category_bs.place_id = places.id INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id`);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.categoryBlistID = async (req, res) => {
	try {
		const id = req.params.id;
		const [results, metadata] =
			await sequelize.query(`select ngo_category_bs.id as id , ngo_categories.name as categoryname , Places.name as name,Places.id as placeid , Places.district_id as districtid , Places.division_id as divisionid,
        ngo_categories.short_name as categoryShortName, ngo_categories.color_code as color_code  from ngo_category_bs INNER JOIN Places on ngo_category_bs.place_id = Places.id INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id where ngo_category_bs.id =${id}`);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.categoryBColor = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(`
				select 
			  places.id as id, 
			  ngo_categories.name as categoryname, 
			  places.name as name, 
			  ngo_categories.short_name as categoryShortName, 
			  ngo_categories.color_code as color_code 
			from 
			  places 
			  INNER JOIN ngo_category_bs on ngo_category_bs.place_id = places.id 
			  INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id 
			`);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.categoryBColorByDivision = async (req, res) => {
	try {
		const division = req.params.id;
		let condition = '';
		if (division) {
			condition += ` and places.division_id = ${division}`;
		}
		const [results, metadata] = await sequelize.query(`
				select 
			  places.id as id, 
			  ngo_categories.name as categoryname, 
			  places.name as name, 
			  ngo_categories.short_name as categoryShortName, 
			  ngo_categories.color_code as color_code 
			from 
			  places 
			  INNER JOIN ngo_category_bs on ngo_category_bs.place_id = places.id 
			  INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id 
			where 
			  ${condition}
			`);

		if (results.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				results
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Sub Place Controller
exports.createSubPlace = async (req, res) => {
	try {
		if (
			req.body.name &&
			// req.body.area &&
			req.body.place_id
			// req.body.assigned_officer &&
			// req.body.officer_phone &&
			// req.body.population &&
			// req.body.type
		) {
			const if_place_exists = await Sub_place.findOne({
				where: { name: req.body.name },
			});
			if (if_place_exists) {
				return apiResponse.ErrorResponse(
					res,
					'Place already found in database.'
				);
			} else {
				await Sub_place.create(req.body);
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'name/area is missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallSubPlace = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ place_id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		}
		const sub_place_data = await Sub_place.findAll({
			include: [
				{
					model: Place,
				},
				{
					model: Upazilla,
				},
				{
					model: Union,
				},
			],
			where: arr,
		});
		if (sub_place_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				sub_place_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchSubPlaceByPlaceId = async (req, res) => {
	try {
		const id = req.params.id;
		const sub_place_data = await Upazilla.findAll({
			include: [
				// {
				// 	model: Place,
				// },
				// {
				// 	model: Upazilla,
				// },
				{
					model: Union,
					include: [
						{
							model: Sub_place,
						},
					],
				},
			],
			where: { place_id: id },
		});
		if (sub_place_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				sub_place_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateSubPlace = async (req, res) => {
	try {
		const sub_place_id = req.params.id;
		const sub_place_data = await Sub_place.findOne({
			where: { id: sub_place_id },
		});
		if (sub_place_data) {
			if (
				req.body.name &&
				// req.body.area &&
				req.body.place_id &&
				// req.body.assigned_officer &&
				// req.body.officer_phone &&
				// req.body.population &&
				// req.body.type
				req.body.name !== ''
			) {
				await Sub_place.update(req.body, {
					where: { id: sub_place_id },
				});
				return apiResponse.successResponse(res, 'data successfully updated!!!');
			} else {
				return apiResponse.ErrorResponse(res, 'name is missing.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteSubPlace = async (req, res) => {
	try {
		const sub_place_id = req.params.id;
		const sub_place_data = await Sub_place.findOne({
			where: { id: sub_place_id },
		});
		if (sub_place_data) {
			await Sub_place.destroy({
				where: { id: sub_place_id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Upazilla Controller
exports.createUpazilla = async (req, res) => {
	try {
		if (req.body.name && req.body.place_id) {
			const if_upazilla_exists = await Upazilla.findOne({
				where: { name: req.body.name },
			});
			if (if_upazilla_exists) {
				return apiResponse.ErrorResponse(
					res,
					'Upazilla already found in database.'
				);
			} else {
				await Upazilla.create(req.body);
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'name/place is missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallUpazilla = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ id: placeIds });
		}
		const upazilla_data = await Upazilla.findAll({
			include: [
				{
					model: Place,
					where: arr,
				},
			],
		});
		if (upazilla_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				upazilla_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallUpazillaByPlaceId = async (req, res) => {
	try {
		const id = req.params.id;
		const upazilla_data = await Upazilla.findAll({
			include: [
				{
					model: Place,
				},
			],
			where: { place_id: id },
		});
		if (upazilla_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				upazilla_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateUpazilla = async (req, res) => {
	try {
		const upazilla_id = req.params.id;
		const upazilla_data = await Upazilla.findOne({
			where: { id: upazilla_id },
		});
		if (upazilla_data) {
			if (req.body.name && req.body.place_id && req.body.name !== '') {
				await Upazilla.update(req.body, {
					where: { id: upazilla_id },
				});
				return apiResponse.successResponse(res, 'data successfully updated!!!');
			} else {
				return apiResponse.ErrorResponse(res, 'name is missing.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteUpazilla = async (req, res) => {
	try {
		const upazilla_id = req.params.id;
		const upazilla_data = await Upazilla.findOne({
			where: { id: upazilla_id },
		});
		if (upazilla_data) {
			await Upazilla.destroy({
				where: { id: upazilla_id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Union Controller
exports.createUnion = async (req, res) => {
	try {
		if (req.body.name && req.body.upazilla_id) {
			const if_union_exists = await Union.findOne({
				where: { name: req.body.name },
			});
			if (if_union_exists) {
				return apiResponse.ErrorResponse(
					res,
					'Union already found in database.'
				);
			} else {
				await Union.create(req.body);
				return apiResponse.successResponse(res, 'Data successfully saved.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'name/upazilla is missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallUnion = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (
			(roleByplace.division.length > 0 &&
				roleByplace.district.length > 0 &&
				roleByplace.place.length > 0) ||
			roleByplace.place.length > 0
		) {
			arr.push({ place_id: roleByplace.place });
		} else if (
			(roleByplace.division.length > 0 && roleByplace.district.length > 0) ||
			roleByplace.district.length > 0
		) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division,
				},
			});

			const placeIds = places.map((place) => place.id);
			arr.push({ place_id: placeIds });
		}

		const union_data = await Union.findAll({
			include: [
				{
					model: Upazilla,
					where: arr,
				},
			],
		});
		if (union_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				union_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallUnionByUpazillaId = async (req, res) => {
	try {
		const id = req.params.id;
		const union_data = await Union.findAll({
			include: [
				{
					model: Upazilla,
				},
			],
			where: { upazilla_id: id },
		});
		if (union_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				union_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateUnion = async (req, res) => {
	try {
		const union_id = req.params.id;
		const union_data = await Union.findOne({
			where: { id: union_id },
		});
		if (union_data) {
			if (req.body.name && req.body.upazilla_id && req.body.name !== '') {
				await Union.update(req.body, {
					where: { id: union_id },
				});
				return apiResponse.successResponse(res, 'data successfully updated!!!');
			} else {
				return apiResponse.ErrorResponse(res, 'name is missing.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteUnion = async (req, res) => {
	try {
		const union_id = req.params.id;
		const union_data = await Union.findOne({
			where: { id: union_id },
		});
		if (union_data) {
			await Union.destroy({
				where: { id: union_id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
// select sum(pyp.total_population) as tota_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female from population_year_places pyp left join places on places.id = pyp.place_id where district_id = 1 group by pyp.place_id

// SELECT year_id,GROUP_CONCAT(ngos.name) as ngo_list,GROUP_CONCAT(ngos.color_code) as color_list,GROUP_CONCAT(percent_served) as percent_list FROM `year_place_ngo_officers` ypno LEFT join ngos on ngos.id = ypno.ngo_id left join places on places.id=ypno.place_id where places.district_id = 1 group by ypno.year_id,ypno.place_id order by ypno.year_id desc
