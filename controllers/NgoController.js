const { Op } = require('sequelize');
const {
	Ngo,
	year_place_ngo_officer,
	Officer,
	ngo_categories,
	Place,
	ngo_category_b,
	ngo_served_percent_by_palces,
	ngo_detail_year_place,
	sequelize,
} = require('../models');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require('../helpers/apiResponse');
var Sequelize = require('sequelize');

exports.create_ngo = async (req, res) => {
	try {
		const filePath = `uploads/logo/${req.file.filename}`;
		req.body.logo = filePath;
	} catch (err) {}
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.created_by = userId;

		if (req.body) {
			await Ngo.create(req.body);
			return apiResponse.successResponse(res, 'data successfully saved.');
		} else {
			return apiResponse.ErrorResponse(res, 'Value missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.fetchById = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const ngo_data = await Ngo.findOne({ where: { id: ngo_id } });
		if (ngo_data) {
			return apiResponse.successResponseWithData(
				res,
				'fetchById- Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'fetchById - No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchall_by_place_id = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const ngo_data = await Ngo.findAll({ where: { place_id: ngo_id } });
		if (ngo_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchall_ngo = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const ngo_data = await Ngo.findAll();
		if (ngo_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.fetchOtherNgo = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const ngo_data = await Ngo.findAll({ where: { type: 'other' }, raw: true });
		if (ngo_data.length > 0) {
			let ngo_datas = [];
			ngo_data.forEach((element, key) => {
				ngo_datas[key] = { Ngo: element };
			});
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_datas
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchNgoCategoris = async (req, res) => {
	try {
		const ngo_data = await ngo_categories.findAll({
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			where: { type: 1 },
		});
		if (ngo_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchNgoType = async (req, res) => {
	try {
		const ngo_data = await ngo_categories.findAll({
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			where: { type: 0 },
		});
		if (ngo_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchNgoCategorisCount = async (req, res) => {
	try {
		// const [results, metadata] =
		// 	await sequelize.query(`SELECT short_name,count(ngo_categories.id) as place_count from ngo_categories LEFT join ngo_category_bs on ngo_categories.id = ngo_category_bs.ngo_category_id where ngo_category_bs.status="colorActive" GROUP by ngo_categories.id
        // `);

		const [results, metadata] =
			await sequelize.query(`SELECT 
  short_name, 
  ngo_categories.id as categoryId,
  count(ngo_categories.id) as place_count 
from 
  ngo_categories 
  LEFT join ngo_category_bs on ngo_categories.id = ngo_category_bs.ngo_category_id 
where 
  -- ngo_category_bs.status = "colorActive" AND
  ngo_category_bs.ngo_category_id = ngo_categories.id
GROUP by 
  ngo_categories.id;`);
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

exports.fetchNgoCategorisCountByDivision = async (req, res) => {
	try {
		// const [results, metadata] =
		// 	await sequelize.query(`SELECT short_name,count(ngo_categories.id) as place_count from ngo_categories LEFT join ngo_category_bs on ngo_categories.id = ngo_category_bs.ngo_category_id where ngo_category_bs.status="colorActive" GROUP by ngo_categories.id
		// `);

		const division = req.params.id
		let condition = '';
		if (division) {
			condition += ` and ngo_category_bs.place_id in ( SELECT id from places WHERE places.division_id = ${division})`
		}

		const [results, metadata] =
			await sequelize.query(`SELECT 
  short_name, 
  ngo_categories.id as categoryId,
  count(ngo_categories.id) as place_count 
from 
  ngo_categories 
  LEFT join ngo_category_bs on ngo_categories.id = ngo_category_bs.ngo_category_id 
where 
  ngo_category_bs.ngo_category_id = ngo_categories.id ${condition}
GROUP by 
  ngo_categories.id;`);
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

{
	/*
exports.fetchall_ngo_by_place = async (req, res) => {
    const place_id = req.params.id;
    try {
        // const ngo_data = await Officer.findAll({
        //     // attributes:['Ngo'],
        //     where:{place_id,
        //         ngo_id: {
        //             [Op.ne]: null
        //         }
        //     },
        //     include: [{
        //         model: Ngo
        //       }],
        //     group:['ngo_id']
        // });
        // const [year_id, metadata] = await sequelize.query(`SELECT max(id) as id FROM years npi`);
        // const ngo_data = await year_place_ngo_officer.findAll({
        //     where: {
        //         place_id,
        //         ngo_id: {
        //             [Op.ne]: null
        //         }, year_id: year_id[0].id
        //     },
        //     include: [{
        //         model: Ngo
        //     },
        //     {
        //         model: Place, where: { id: place_id }
        //     },
        //     {
        //         model: ngo_served_percent_by_palces, where: { place_id: place_id }, required: false
        //     }],
        //     group: ['ngo_id']
        // });
        const ngo_data = await Ngo.findAll({
            // where: {
            //     place_id,
            //     ngo_id: {
            //         [Op.ne]: null
            //     }, year_id: year_id[0].id
            // },
            // include: [{
            //     model: Ngo
            // },
            // {
            //     model: Place, where: { id: place_id }
            // },
            // {
            //     model: ngo_served_percent_by_palces, where: { place_id: place_id }, required: false
            // }],
            // group: ['ngo_id']
        });

        if (ngo_data.length > 0) {
            return apiResponse.successResponseWithData(res, "Data fetch successfull.", ngo_data)

        } else {
            return apiResponse.ErrorResponse(res, "No data found!!!")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
*/
}
exports.fetchall_ngo_by_place = async (req, res) => {
	const place_id = req.params.id;
	//const place_id = 1;
	try {
		const ngo_data = await Ngo.findAll({
			include: [
				{
					model: ngo_served_percent_by_palces,
					where: { place_id: place_id },
					required: false,
				},

			],
			order: [
				Sequelize.fn('isnull', Sequelize.col('view_order')),
				['view_order', 'ASC'],
			],
		});

		const place_data = await Place.findOne({
			where: { id: place_id },
			raw: true,
		});

		// Create a new array that contains the NGO id, name, and percent

		const result = [];
		ngo_data.forEach((ngo) => {
			const percentData = ngo.ngo_served_percent_by_palces;
			const percent = percentData && percentData.length > 0 ? percentData[0].percent : null;
			const ngoServedPercentByPlaceId = percentData && percentData.length > 0 ? percentData[0].id : null;
			result.push({
				id: ngo.id,
				name: ngo.name,
				divisionid: place_data?.division_id,
				districtid: place_data?.district_id,
				placeid: Number(place_id),
				percent,
				ngoServedPercentByPlaceId,
				
			});
		});

		if (result.length > 0) {
			//console.log(result);
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successful.',
				result
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.fetchall_year_place_ngo = async (req, res) => {
	try {
		// const ngo_data = await year_place_ngo_officer.findAll({
		//     where:{
		//                 ngo_id: {
		//                     [Op.ne]: null
		//                 }
		//         },
		//         include: [{
		//                 model: Ngo
		//             }],
		//         group:['ngo_id']
		// });
		const [results, metadata] = await sequelize.query(
			`select * from ngos INNER JOIN places on ngos.id = places.ngo_id`
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
exports.fetchNgoCategorisByPlace = async (req, res) => {
	const place_id = req.params.id;
	try {
		const ngo_data = await ngo_category_b.findAll({
			where: { place_id },
			include: [
				{
					model: ngo_categories,
					as: 'category',
					attributes: { exclude: ['createdAt', 'updatedAt'] },
				},
			],
		});
		if (ngo_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				ngo_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.update_ngo = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const filePath = `uploads/logo/${req.file.filename}`;
		req.body.logo = filePath;
	} catch (err) {}
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.updated_by = userId;
		const ngo_data = await Ngo.findAll({ where: { id: ngo_id } });
		if (req.body.view_order == '') {
			req.body.view_order = null;
		}
		if (req.body.ngo_jots_id == '') {
			req.body.ngo_jots_id = null;
		}
		//req.body.view_order=1;
		//req.body.ngo_jot_id=null;
		if (ngo_data.length > 0) {
			if (req.body) {
				await Ngo.update(req.body, { where: { id: ngo_id } });
				return apiResponse.successResponse(res, 'data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'Value missing.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.delete_by_id = async (req, res) => {
	const ngo_id = req.params.id;
	try {
		const ngo_data = await Ngo.findAll({ where: { id: ngo_id } });
		if (ngo_data.length > 0) {
			await Ngo.destroy({ where: { id: ngo_id } });
			return apiResponse.successResponse(res, 'Data deleted successfully.');
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.NgoCounter = async (req, res) => {
	try {
		const [results, metadata] = await Ngo.sequelize.query(
			'Select (select count(*) FROM places WHERE places.ngo_id = "6") as Count1, (select count(*) FROM ngo_category_bs where ngo_category_id="1" AND status="colorActive") as Count2 , (select count(*) FROM ngo_category_bs where ngo_category_id="4" AND status="colorActive") as Count3'
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

exports.PlaceCountByNgoId = async (req, res) => {
	try {
		const [results, metadata] = await Ngo.sequelize.query(
			`SELECT COUNT(place_id) AS place_count
			FROM (
			  SELECT ngo_id, place_id, MAX(percent) max_popularity
			  FROM ngo_served_percent_by_palces
			  WHERE percent IS NOT NULL
			  GROUP BY place_id
			) AS subquery
			WHERE ngo_id = ${req.params.id}`
		);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			results
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}

exports.PlaceCountByNgo40 = async (req, res) => {
	try {
		const [results, metadata] = await Ngo.sequelize.query(
			`SELECT COUNT(place_id) AS place_count
			FROM (
			  SELECT place_id, percent
			  FROM ngo_served_percent_by_palces
			  WHERE percent > 10 AND ngo_id = 40
			  GROUP BY place_id
			) AS subquery;`
		);

		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			results
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}

// SELECT ( SELECT COUNT(*) FROM places WHERE places.ngo_id = "6" ) AS catACount, ( SELECT COUNT(*) FROM ngo_category_bs where ngo_category_bs.ngo_category_id="1" AND ngo_category_bs.status="colorActive" ) AS catBA FROM dual

// Select (select count(*) FROM places WHERE places.ngo_id = "6") as Count1, (select count(*) FROM ngo_category_bs where ngo_category_id="1" AND status="colorActive") as Count2 , (select count(*) FROM ngo_category_bs where ngo_category_id="4" AND status="colorActive") as Count3
