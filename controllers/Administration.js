const apiResponse = require('../helpers/apiResponse');
const {
	Administration_office,
	Administration_officer_type,
	Place_comment,
	Tag,
	Place,
	Administration_officer,
	Ngo,
	District,
	Division,
} = require('../models');
const sequelize = require('sequelize');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const checkUserRoleByPlace = require('./globalController');

exports.create = async (req, res) => {
	try {
		if (req.body.name && req.body.ordering && req.body.name !== '') {
			await Administration_office.create(req.body);
			return apiResponse.successResponse(res, 'data successfully saved!!!');
		} else {
			return apiResponse.ErrorResponse(
				res,
				'name or ordering parameter is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchall = async (req, res) => {
	try {
		const admin_office_data = await Administration_office.findAll({
			include: [
				{
					model: Administration_officer,
				},
			],
			order: [[sequelize.literal('ordering'), 'ASC']],
		});
		if (admin_office_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				admin_office_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.fetch_admin_office_by_place_id = async (req, res) => {
// 	try {
// 		const place_id = req.params.id;
// 		const value_name = req.params.value;
// 		let arr = [];
// 		if (value_name == 'place') {
// 			arr.push({ place_id: place_id });
// 		} else if (value_name == 'district') {
// 			arr.push({ district_id: place_id });
// 		} else if (value_name == 'division') {
// 			arr.push({ division_id: place_id });
// 		}

// 		const admin_office_data = await Administration_office.findAll({
// 			include: [
// 				{
// 					model: Administration_officer,
// 					include: [
// 						{
// 							model: Administration_officer_type,
// 						},
// 						{
// 							model: Ngo,
// 						},
// 					],
// 					where: arr,
// 				},
// 			],
// 			order: [[sequelize.literal('ordering'), 'ASC']],
// 		});
// 		if (admin_office_data) {
// 			return apiResponse.successResponseWithData(
// 				res,
// 				'Data fetch successfull.',
// 				admin_office_data
// 			);
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No data found!!!');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.fetch_admin_office_by_condition = async (req, res) => {
	try {
		const place_id = req.params.id;
		const value_name = req.params.condition;
		let arr = [];
		if (value_name == 'place') {
			const res = await Place.findOne({
				attributes: ['id', 'district_id', 'division_id'],
				where: {
					id: place_id,
				},
			});
			//arr.push({ place_id: place_id });
			//arr.push({ district_id: res.district_id },{place_id: null});
			//arr.push({ division_id: res.division_id },{district_id: null},{place_id: null});

			arr.push({ place_id: place_id });
			arr.push({
			  [Op.or]: [
			    { [Op.and]: [{ district_id: res.district_id }, { place_id: null }] },
			    { [Op.and]: [{ division_id: res.division_id },{district_id: null},{place_id: null}] },
			  ],
			})



		} else if (value_name == 'district') {
			// const res = await Place.findAll({
			// 	attributes: ['id'],
			// 	where: {
			// 		district_id: place_id,
			// 	},
			// });

			// const placeIds = res.map((place) => place.id);
			// arr.push({ place_id: placeIds });

			const res = await District.findOne({
				attributes: ['id','division_id'],
				where: {
					id: place_id,
				},
			});

			arr.push({ district_id: place_id });
			arr.push({
			  [Op.or]: [
			    { [Op.and]: [{ division_id: res.division_id },{district_id: null}] },
			  ],
			})
			//arr.push({ division_id: res.division_id },{district_id: null});
		} else if (value_name == 'division') {
			arr.push({ division_id: place_id });
		}

		const admin_office_data = await Administration_office.findAll({
			include: [
				{
					model: Administration_officer,
					include: [
						{
							model: Administration_officer_type,
						},
						{
							model: Ngo,
						},
					],
					where: {
						[Op.or]: arr,
					},
				},
			],
			order: [[sequelize.literal('ordering'), 'ASC']],
		});

		if (admin_office_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successful.',
				admin_office_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.delete = async (req, res) => {
	try {
		const admin_office_id = req.params.id;
		const admin_office_data = await Administration_office.findOne({
			where: { id: admin_office_id },
		});
		if (admin_office_data) {
			await Administration_office.destroy({ where: { id: admin_office_id } });
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.update = async (req, res) => {
	try {
		const admin_office_id = req.params.id;
		const admin_office_data = await Administration_office.findOne({
			where: { id: admin_office_id },
		});
		if (admin_office_data) {
			if (req.body.name && req.body.ordering && req.body.name !== '') {
				await Administration_office.update(req.body, {
					where: { id: admin_office_id },
				});
				return apiResponse.successResponse(res, 'data successfully saved!!!');
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name or ordering parameter is missing.'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Administration officer type controller

exports.create_admin_officer_type = async (req, res) => {
	try {
		if (
			req.body.name &&
			req.body.administration_office_id &&
			req.body.name !== ''
		) {
			await Administration_officer_type.create(req.body);
			return apiResponse.successResponse(res, 'data successfully saved!!!');
		} else {
			return apiResponse.ErrorResponse(res, 'name parameter is missing.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.fetchallAdminType = async (req, res) => {
	try {
		const admin_officer_type_data = await Administration_officer_type.findAll({
			include: [
				{
					model: Administration_office,
				},
			],
			order: [[sequelize.literal('view_sort'), 'ASC']],
		});
		if (admin_officer_type_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				admin_officer_type_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.fetchallAdminTypeById = async (req, res) => {
	try {
		const id = req.params.id;
		const admin_officer_type_data = await Administration_officer_type.findAll({
			include: [
				{
					model: Administration_office,
				},
			],
			order: [[sequelize.literal('view_sort'), 'ASC']],
			where: { administration_office_id: id },
		});
		if (admin_officer_type_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				admin_officer_type_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateAdminType = async (req, res) => {
	try {
		const admin_officer_type_id = req.params.id;
		const admin_officer_type_data = await Administration_officer_type.findOne({
			where: { id: admin_officer_type_id },
		});
		if (admin_officer_type_data) {
			if (
				req.body.name &&
				req.body.administration_office_id &&
				req.body.name !== ''
			) {
				await Administration_officer_type.update(req.body, {
					where: { id: admin_officer_type_id },
				});
				return apiResponse.successResponse(res, 'data successfully updated!!!');
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name or view sort parameter is missing.'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteAdminType = async (req, res) => {
	try {
		const admin_officer_type_id = req.params.id;
		const admin_officer_type_data = await Administration_officer_type.findOne({
			where: { id: admin_officer_type_id },
		});
		if (admin_officer_type_data) {
			await Administration_officer_type.destroy({
				where: { id: admin_officer_type_id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Place comment controller
exports.place_comment_create = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.created_by = userId;
		if (
			req.body.comment &&
			req.body.comment !== '' &&
			req.body.place_id &&
			req.body.place_id !== '' &&
			req.body.tag_id &&
			req.body.tag_id !== ''
		) {
			await Place_comment.create(req.body);
			return apiResponse.successResponse(res, 'data successfully saved!!!');
		} else {
			return apiResponse.ErrorResponse(
				res,
				'comment/place_id/tag_id parameter is missing.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// exports.getplacecommentbyid = async(req,res) => {
//     try{
//         const place_id = req.params.id;
//         const place_comment_data = await Place_comment.findAll({include:[Tag]},{where:{place_id: place_id}});
//         if(place_comment_data .length > 0){
//             return apiResponse.successResponseWithData(res,"Data successfully fetched.",place_comment_data)
//         }else{
//             return apiResponse.ErrorResponse(res,"No matching query found")
//         }

//     }catch(err){
//         return apiResponse.ErrorResponse(res,err.message)
//     }
// }

exports.getplacecommentbyid = async (req, res) => {
	try {
		const place_id = req.params.id;
		const place_comment_data = await Tag.findAll({
			include: [
				{
					model: Place_comment,
					where: { place_id: place_id },
				},
			],
		});
		if (place_comment_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'getplacecommentbyid-Administration Comments by place fetched successfully',
				place_comment_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'getplacecommentbyid- No data for Administration Comment by place');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};



// exports.getplacecommentbyid = async (req, res) => {
//   try {
//     const place_id = req.params.id;
//     const place_comment_data = await Tag.findAll({
//       include: [
//         {
//           model: Place_comment,
//           where: { place_id: place_id },
//         },
//       ],
//     });
//     if (place_comment_data.length > 0) {
//       return apiResponse.successResponseWithData(
//         res,
//         'getplacecommentbyid-Administration Comments by place fetched successfully',
//         place_comment_data
//       );
//     } else {
//       return apiResponse.successResponseWithData(
//         res,
//         'getplacecommentbyid- No data for Administration Comment by place',
//         []
//       );
//     }
//   } catch (err) {
//     return apiResponse.ErrorResponse(res, err.message);
//   }
// };


exports.getplacecommentbydistrictid = async (req, res) => {
	try {
		const district_id = req.params.id;
		let place_id = [];
		const get_place_by_district = await Place.findAll({
			where: {
				district_id: district_id,
			},
		});

		for (i = 0; i < get_place_by_district.length; i++) {
			place_id.push(get_place_by_district[i].id);
		}

		const place_comment_data = await Tag.findAll({
			include: [
				{
					model: Place_comment,
					where: { place_id: place_id },
				},
			],
		});
		if (place_comment_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_comment_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getplacecommentbydivisionid = async (req, res) => {
	try {
		const division_id = req.params.id;
		let place_id = [];
		const get_place_by_division = await Place.findAll({
			where: {
				division_id: division_id,
			},
		});

		for (i = 0; i < get_place_by_division.length; i++) {
			place_id.push(get_place_by_division[i].id);
		}

		const place_comment_data = await Tag.findAll({
			include: [
				{
					model: Place_comment,
					where: { place_id: place_id },
				},
			],
		});
		if (place_comment_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_comment_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.getallplacecomment = async (req, res) => {
	try {
		const place_comment_data = await Place_comment.findAll({
			include: [Tag, Place],
		});
		if (place_comment_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_comment_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.getallplacecomment = async (req, res) => {
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
		const place_comment_data = await Place_comment.findAll({
			include: [Tag, Place],
			where: arr,
		});
		if (place_comment_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				place_comment_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No Data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.place_comment_delete = async (req, res) => {
	try {
		const place_comment_id = req.params.id;
		const place_comment_data = await Place_comment.findOne({
			where: { id: place_comment_id },
		});
		if (place_comment_data) {
			await Place_comment.destroy({ where: { id: place_comment_id } });
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.place_comment_update = async (req, res) => {
	try {
		const place_comment_id = req.params.id;
		const place_comment_data = await Place_comment.findOne({
			where: { id: place_comment_id },
		});
		if (place_comment_data) {
			const token = req.headers.authorization.split(' ')[1];
			const decodedToken = jwt.verify(token, secret);
			const userId = decodedToken._id;
			req.body.created_by = userId;
			if (
				req.body.comment &&
				req.body.comment !== '' &&
				req.body.place_id &&
				req.body.place_id !== '' &&
				req.body.tag_id &&
				req.body.tag_id !== ''
			) {
				await Place_comment.update(req.body, {
					where: { id: place_comment_id },
				});
				return apiResponse.successResponse(res, 'data successfully saved!!!');
			} else {
				return apiResponse.ErrorResponse(
					res,
					'comment/place_id/tag_id parameter is missing.'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.create_administration_officer = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/admin_officer_photo/${req.file.filename}`;
		req.body.filename = filePath;
	}
	try {
		// if (req.body.district_id === 'null' || req.body.district_id === '') {
		// 	req.body.district_id = null;
		// }

		// if (req.body.ordering === 'null' || req.body.ordering === '') {
		// 	req.body.ordering = null;
		// }

		// if (req.body.place_id === 'null' || req.body.place_id === '') {
		// 	req.body.place_id = null;
		// }
		// if (
		// 	req.body.administration_office_id === 'null' ||
		// 	req.body.administration_office_id === ''
		// ) {
		// 	req.body.administration_office_id = null;
		// }

		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;

		req.body.created_by = userId;
		for (const key in req.body) {
			if (req.body[key] === 'null') {
				req.body[key] = null;
			}
		}
		const exist_data = await Administration_officer.findAll({
			where: { email: req.body.email, phone: req.body.phone },
		});
		if (exist_data.length > 0) {
			return apiResponse.ErrorResponse(res, 'Duplicate officer data found.');
		} else {
			await Administration_officer.create(req.body);
			return apiResponse.successResponse(res, 'data successfully saved!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getadministration_officerbyplaceid = async (req, res) => {
	try {
		const place_id = req.params.id;
		const administration_officer_data = await Administration_officer.findAll(
			{ include: [Administration_office, Division, District] },
			{ where: { place_id: place_id } }
		);
		if (administration_officer_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				administration_officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

/*
exports.getadministration_officer = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if (roleByplace.district.length > 0) {
			arr.push({ district_id: roleByplace.district });
		} else if (roleByplace.division.length > 0) {
			arr.push({ division_id: roleByplace.division });
		} else if (roleByplace.place.length > 0) {
			arr.push({ place_id: roleByplace.place });
		}
		const administration_officer_data = await Administration_officer.findAll({
			include: [
				{
					model: Division,
				},
				{
					model: District,
				},
				{
					model: Place,
				},
				{
					model: Administration_officer_type,
				},
				{
					model: Administration_office,
					// include: [
					// 	{
					// 		model: Administration_officer_type,
					// 	},
					// ],
				},
				{
					model: Ngo,
				},
			],
			// include: [Administration_office, Division, District, Place , Administration_officer_type],
			where: arr,
		});
		if (administration_officer_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				administration_officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
*/

exports.getadministration_officer = async (req, res) => {
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

		const administration_officer_data = await Administration_officer.findAll({
			include: [
				{
					model: Division,
				},
				{
					model: District,
				},
				{
					model: Place,
				},
				{
					model: Administration_officer_type,
				},
				{
					model: Administration_office,
				},
				{
					model: Ngo,
				},
			],
			where: whereCondition,
		});

		if (administration_officer_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				administration_officer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.update_administration_officerbyid = async (req, res) => {
	try {
		const id = req.params.id;
		const administration_officer_data = await Administration_officer.findAll({
			where: { id: id },
		});

		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		if (administration_officer_data.length > 0) {
			if (req.file) {
				const filePath = `uploads/admin_officer_photo/${req.file.filename}`;
				req.body.filename = filePath;
			}
			try {
				//console.log(req.body);
				// if (
				// 	req.body.district_id === 'null' ||
				// 	req.body.district_id === ''
				// ) {
				// 	req.body.district_id = null;
				// }

				// if (req.body.ordering === 'null' || req.body.ordering === '') {
				// 	req.body.ordering = null;
				// }

				// if (req.body.place_id === 'null' || req.body.place_id === '') {
				// 	req.body.place_id = null;
				// }
				// if (
				// 	req.body.administration_office_id === 'null' ||
				// 	req.body.administration_office_id === ''
				// ) {
				// 	req.body.administration_office_id = null;
				// }

				// req.body.updated_by = userId;
				// if (req.body.division_id && req.body.division_id !== '') {
				// 	await Administration_officer.update(req.body, { where: { id: id } });
				// 	return apiResponse.successResponse(
				// 		res,
				// 		'data successfully updated!!!'
				// 	);
				// } else {
				// 	return apiResponse.ErrorResponse(
				// 		res,
				// 		'parameter or value is missing.'
				// 	);
				// }

				// console.log(req.body);
				for (const key in req.body) {
					if (req.body[key] === 'null') {
						req.body[key] = null;
					}
				}
				// console.log(req.body);
				//return('die');

				await Administration_officer.update(req.body, { where: { id: id } });
				return apiResponse.successResponse(res, 'data successfully updated!!!');
			} catch (err) {
				req.body.updated_by = userId;
				if (
					req.body.name &&
					req.body.ordering &&
					req.body.name !== '' &&
					req.body.place_id &&
					req.body.place_id !== '' &&
					req.body.email &&
					req.body.email !== '' &&
					req.body.phone &&
					req.body.phone !== ''
				) {
					await Administration_officer.update(req.body, { where: { id: id } });
					return apiResponse.successResponse(
						res,
						'data successfully updated!!!'
					);
				} else {
					return apiResponse.ErrorResponse(
						res,
						'parameter or value is missing.'
					);
				}
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.administration_officer_delete = async (req, res) => {
	try {
		const administration_officer_id = req.params.id;
		const administration_officer_data = await Administration_officer.findOne({
			where: { id: administration_officer_id },
		});
		if (administration_officer_data) {
			await Administration_officer.destroy({
				where: { id: administration_officer_id },
			});
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
