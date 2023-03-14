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
	ngo_jots,
	Division,
	District,
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
exports.getallPlace = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		// console.log(roleByplace)
		let arr = [];
		if (roleByplace.district.length > 0) {
			arr.push({ district_id: roleByplace.district });
		} else if (roleByplace.division.length > 0) {
			arr.push({ division_id: roleByplace.division });
		} else if (roleByplace.place.length > 0) {
			arr.push({ id: roleByplace.place });
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
		const district_data = await District.findOne({ where: { id: id } });
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
exports.getPlacesByDivision = async (req, res) => {
	try {
		const id = req.params.id;
		const [results, metadata] = await sequelize.query(
			`select Places.name,Officers.name as officer_name,Places.id as place_id,Officers.image,Officers.id as officer_id,Ngos.name as ngo_name,Places.area,place_ngo.short_name,place_ngo.color_code,ngo_categories.color_code as categoryb_color,ngo_categories.short_name as categoryb_name from Places LEFT JOIN year_place_ngo_officers ypno on ypno.place_id = Places.id LEFT JOIN Officers on Officers.id = ypno.officer_id left join Ngos on Ngos.id = ypno.ngo_id left join Ngos place_ngo on  place_ngo.id = Places.ngo_id left join ngo_category_bs on ngo_category_bs.place_id = Places.id AND ngo_category_bs.status="colorActive" left join ngo_categories on ngo_category_bs.ngo_category_id = ngo_categories.id where Places.division_id = ${id} GROUP BY Places.id`
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
			`select Places.name,Officers.name as officer_name,Places.id as place_id,Officers.image,Officers.id as officer_id,Ngos.name as ngo_name,Places.area,place_ngo.short_name,place_ngo.color_code,ngo_categories.color_code as categoryb_color,ngo_categories.short_name as categoryb_name from Places LEFT JOIN year_place_ngo_officers ypno on ypno.place_id = Places.id LEFT JOIN Officers on Officers.id = ypno.officer_id left join Ngos on Ngos.id = ypno.ngo_id left join Ngos place_ngo on  place_ngo.id = Places.ngo_id left join ngo_category_bs on ngo_category_bs.place_id = Places.id left join ngo_categories on ngo_category_bs.ngo_category_id = ngo_categories.id where Places.district_id = ${id} GROUP BY Places.id`
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
exports.addCategoryB = async (req, res) => {
	try {
		ngo_category_b.destroy({ where: { place_id: req.body.place_id } });
		if (req.body.place_id && req.body.datas) {
			for (let index = 0; index < req.body.datas.length; index++) {
				const element = req.body.datas[index];
				element.place_id = req.body.place_id;
				await ngo_category_b.create(element);
			}
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
		const place_data = await year_place_ngo_officer.sequelize.query(
			'SELECT years.name as year_id,years.bn_term as term,GROUP_CONCAT(Ngos.name) as ngo_list,GROUP_CONCAT(Ngos.color_code) as color_list,GROUP_CONCAT(percent_served) as percent_list FROM `year_place_ngo_officers` ypno LEFT join Ngos on Ngos.id = ypno.ngo_id LEFT join years on years.id = ypno.year_id  where ypno.place_id = ' +
				place_id +
				' group by ypno.year_id,ypno.place_id order by ypno.year_id desc',
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

exports.AllPlaceHistory = async (req, res) => {
	const place_id = req.params.id;
	try {
		const place_data = await year_place_ngo_officer.sequelize.query(
			'SELECT GROUP_CONCAT(DISTINCT(ngo_id)) as ngoID,GROUP_CONCAT(DISTINCT(Ngos.name) ORDER BY Ngos.id ASC) as ngo_list,GROUP_CONCAT(DISTINCT(Ngos.short_name)) as ngo_short_name,GROUP_CONCAT(DISTINCT(Ngos.color_code) ORDER BY Ngos.id ASC) as color_list,years.name as year_id,years.bn_term as term,(SELECT GROUP_CONCAT(cnt) cnt FROM ( SELECT COUNT(*) cnt,year_id FROM year_place_ngo_officers ypno where rank=1 GROUP BY ypno.ngo_id,year_id )as totla WHERE totla.year_id = year_place_ngo_officers.year_id) as percent_list FROM `year_place_ngo_officers` LEFT join Ngos on Ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN years on year_place_ngo_officers.year_id = years.id where rank=1 GROUP by year_id order by year_place_ngo_officers.year_id desc',
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
		const [results, metadata] = await year_place_ngo_officer.sequelize.query(
			`SELECT GROUP_CONCAT(DISTINCT(year_place_ngo_officers.ngo_id)) as ngoID,GROUP_CONCAT(DISTINCT(Ngos.name) order by Ngos.id asc) as ngo_list,GROUP_CONCAT(DISTINCT(Ngos.short_name)) as ngo_short_name,GROUP_CONCAT(DISTINCT(Ngos.color_code) order by Ngos.id asc) as color_list,years.name as year_id,years.bn_term as term,(SELECT GROUP_CONCAT(cnt) cnt FROM ( SELECT COUNT(*) cnt,year_id,place_id  FROM year_place_ngo_officers ypno left join Places on Places.id = ypno.place_id left join Districts on Districts.id = Places.district_id where rank=1 and district_id=${dis_id} GROUP BY ypno.ngo_id,year_id )as totla WHERE totla.year_id = year_place_ngo_officers.year_id ) as percent_list FROM year_place_ngo_officers LEFT join Ngos on Ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN years on year_place_ngo_officers.year_id = years.id left join Places on Places.id = year_place_ngo_officers.place_id left join Districts on Districts.id = Places.district_id where rank=1 and district_id=${dis_id}  GROUP by year_id DESC`
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
			.query(`SELECT GROUP_CONCAT(DISTINCT(year_place_ngo_officers.ngo_id)) as ngoID,GROUP_CONCAT(DISTINCT(Ngos.name) order by Ngos.id asc) as ngo_list,GROUP_CONCAT(DISTINCT(Ngos.short_name)) as ngo_short_name,GROUP_CONCAT(DISTINCT(Ngos.color_code) order by Ngos.id asc) as color_list,years.name as year_id,years.bn_term as term,(SELECT GROUP_CONCAT(cnt) cnt FROM 
        ( SELECT COUNT(*) cnt,year_id,place_id 
         FROM year_place_ngo_officers ypno left join Places on Places.id = ypno.place_id left join Divisions on Divisions.id = Places.division_id
         where rank=1 and division_id=${dis_id} GROUP BY ypno.ngo_id,year_id )as totla WHERE totla.year_id = year_place_ngo_officers.year_id ) as percent_list FROM year_place_ngo_officers LEFT join Ngos on Ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN years on year_place_ngo_officers.year_id = years.id left join Places on Places.id = year_place_ngo_officers.place_id left join Divisions on Divisions.id = Places.division_id where rank=1 and division_id=${dis_id} GROUP by year_id DESC`);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			results
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

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
					place_id: req.body.place_id,
					ngo_id: ngo_id[i].Ngo.id,
				},
			});
			req.body.ngo_id = ngo_id[i].Ngo.id;
			req.body.percent = ngo_id[i]?.ngo_served_percent_by_palce?.percent ?? 0;
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
exports.ngoJotAddIntoPlace = async (req, res) => {
	try {
		let prev_state = req.body.ngo_jot_id;
		for (i = 0; i < prev_state.length; i++) {
			await ngo_jot_add_into_places.destroy({
				where: {
					place_id: req.body.place_id,
					ngo_jot_id: prev_state[i].id,
				},
			});

			req.body.ngo_jot_id = prev_state[i].id;
			if (prev_state[i]?.percent) {
				req.body.percent = prev_state[i]?.percent;
			} else {
				req.body.percent = 0;
			}
			await ngo_jot_add_into_places.create(req.body);
		}
		// await ngo_jot_add_into_places.create(req.body);
		return apiResponse.successResponse(res, 'Data successfully saved.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.allNgoJotAddIntoPlace = async (req, res) => {
	try {
		const place_data = await ngo_jot_add_into_places.findAll({
			include: [Place, ngo_jots, Division, District],
			// group:"place_id"
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
			`select Ngos.id as id , Places.name as name, Ngos.name as ngoname, Ngos.color_code as color_code, Ngos.short_name as short_name  from Ngos INNER JOIN Places on Ngos.id = Places.ngo_id`
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

exports.categoryBlist = async (req, res) => {
	try {
		const [results, metadata] =
			await sequelize.query(`select ngo_category_bs.id as id , ngo_categories.name as categoryname , Places.name as name, Places.id as placeid , Places.district_id as districtid , Places.division_id as divisionid,
        ngo_categories.short_name as categoryShortName, ngo_categories.color_code as color_code  from ngo_category_bs INNER JOIN Places on ngo_category_bs.place_id = Places.id INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id where ngo_category_bs.status ="colorActive"`);

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
		const id = req.params.id
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
		const [results, metadata] =
			await sequelize.query(`select Places.id as id , ngo_categories.name as categoryname , Places.name as name, 
        ngo_categories.short_name as categoryShortName, ngo_categories.color_code as color_code  from Places INNER JOIN ngo_category_bs on ngo_category_bs.place_id = Places.id  INNER JOIN ngo_categories on ngo_categories.id = ngo_category_bs.ngo_category_id where ngo_category_bs.status ="colorActive"`);

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
		const sub_place_data = await Sub_place.findAll({
			include: [
				{
					model: Place,
				},
			],
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
		const sub_place_data = await Sub_place.findAll({
			include: [
				{
					model: Place,
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

// select sum(pyp.total_population) as tota_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female from population_year_places pyp left join Places on Places.id = pyp.place_id where district_id = 1 group by pyp.place_id

// SELECT year_id,GROUP_CONCAT(Ngos.name) as ngo_list,GROUP_CONCAT(Ngos.color_code) as color_list,GROUP_CONCAT(percent_served) as percent_list FROM `year_place_ngo_officers` ypno LEFT join Ngos on Ngos.id = ypno.ngo_id left join Places on Places.id=ypno.place_id where Places.district_id = 1 group by ypno.year_id,ypno.place_id order by ypno.year_id desc
