const apiResponse = require('../helpers/apiResponse');
const {
	User_role,
	Previlege_area,
	User,
	Previlege_url,
	Previlege_table,
	Previlege_place_division_district,
	District,
	Division,
	Place,
	Sequelize,
	sequelize,
} = require('../models');
const db = require('../db/db');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const base_dir_config = require('../config.js');
const { Op } = require('sequelize');
const os = require('os');
const readXlsxFile = require('read-excel-file/node');
const xlsx = require('xlsx');

exports.getRoleId = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		console.log('decodedToken', decodedToken);
		const roleId = decodedToken.role;

		if (roleId) {
			return apiResponse.successResponseWithData(
				res,
				'Data fetch successfull.',
				roleId
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found!!!');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createuserrole = async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			return apiResponse.ErrorResponse(
				res,
				'name,permission,previlege_id missing'
			);
		} else {
			await User_role.create(req.body);
			return apiResponse.successResponse(res, 'role saved successfully.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createplacerole = async (req, res) => {
	try {
		if (req.body) {
			await Previlege_place_division_district.create(req.body);
			return apiResponse.successResponse(res, 'role saved successfully.');
		} else {
			return apiResponse.ErrorResponse(res, 'data missing');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getplacerole = async (req, res) => {
	try {
		const role_id = req.params.id;
		const fetch_data = await Previlege_place_division_district.findAll({
			include: [District, Division, Place],
			where: { user_role_id: role_id },
		});
		if (fetch_data.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				'role fetched successfully.',
				fetch_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'data not found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteplacerole = async (req, res) => {
	try {
		const id = req.params.id;
		const fetch_data = await Previlege_place_division_district.findOne({
			where: { id: id },
		});
		if (fetch_data) {
			await Previlege_place_division_district.destroy({ where: { id: id } });
			return apiResponse.successResponse(res, 'role deleted successfully.');
		} else {
			return apiResponse.ErrorResponse(res, 'data not found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateuserrole = async (req, res) => {
	try {
		const roleId = req.params.id;
		const fetchData = await User_role.findOne({ where: { id: roleId } });
		if (fetchData) {
			if (req.body.name) {
				await User_role.update(req.body, { where: { id: roleId } });
				return apiResponse.successResponse(res, 'role saved successfully.');
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name,permission,previlege_id missing'
				);
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.assignuserrole = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.role_id && req.body.user_id) {
				await User.update(
					{ role_id: req.body.role_id },
					{ where: { id: req.body.user_id } }
				);
				return apiResponse.successResponse(res, 'role successfully assigned.');
			} else {
				return apiResponse.ErrorResponse(res, 'role_id/user_id missing');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to assign user role.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.removeuserrole = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.user_id) {
				await User.update(
					{ role_id: null },
					{ where: { id: req.body.user_id } }
				);
				return apiResponse.successResponse(res, 'role successfully removed.');
			} else {
				return apiResponse.ErrorResponse(res, 'user_id missing');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to remove user role.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getallrole = async (req, res) => {
	try {
		const role_data = await User_role.findAll();
		if (role_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				role_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Role table is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getallprevilegearea = async (req, res) => {
	try {
		const previlegearea_data = await Previlege_area.findAll();
		if (previlegearea_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				previlegearea_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Previlege area is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getprevilegeareabyid = async (req, res) => {
	const id = req.params.id;
	try {
		const previlegearea_data = await Previlege_area.findOne({
			where: { id: id },
		});
		if (previlegearea_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				previlegearea_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Previlege area does not found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getallprevilegeurl = async (req, res) => {
	try {
		// const previlegearea_data = await Previlege_url.findAll({
		//     include:[Previlege_area],
		//     order: [['id', 'ASC']],
		// });
		// const previlegearea_data = await Previlege_url.findAll({
		//   include: [
		//     {
		//       model: Previlege_area,
		//       order: [['view_order', 'ASC'], ['id', 'ASC']],
		//     },
		//   ],
		//   order: [['view_order', 'ASC'], ['id', 'ASC']],
		// });
		// const previlegearea_data = await Previlege_url.findAll({
		//   include: [
		//     {
		//       model: Previlege_area,
		//       order: [
		//         ['view_order', 'ASC'],
		//         ['id', 'ASC'],
		//       ],
		//     },
		//   ],
		//   order: [
		//     ['view_order', 'ASC'],
		//     ['id', 'ASC'],
		//   ],
		// });

		const previlegearea_data = await Previlege_url.findAll({
			include: [
				{
					model: Previlege_area,
					order: [
						[
							Sequelize.literal(
								'CASE WHEN parea_order IS NULL THEN 1 ELSE 0 END'
							),
							'ASC',
						],
						[Sequelize.literal('parea_order'), 'ASC'],
						['id', 'ASC'],
					],
				},
			],
			order: [
				[
					Sequelize.literal('CASE WHEN url_order IS NULL THEN 1 ELSE 0 END'),
					'ASC',
				],
				[Sequelize.literal('url_order'), 'ASC'],
				['id', 'ASC'],
			],
		});

		if (previlegearea_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				previlegearea_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Previlege url is empty.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getprevilegeurlbyid = async (req, res) => {
	const id = req.params.id;
	try {
		const previlegearea_data = await Previlege_url.findOne({
			include: [Previlege_area],
			where: { id: id },
		});
		if (previlegearea_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				previlegearea_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'Previlege url dosenot found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.createprevilegearea = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.name) {
				await Previlege_area.create(req.body);
				return apiResponse.successResponse(
					res,
					'previlege area successfully created.'
				);
			} else {
				return apiResponse.ErrorResponse(res, 'name missing');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to create previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.updateprevilegearea = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.name) {
				const if_exist = await Previlege_area.findOne({ where: { id: id } });
				if (if_exist) {
					await Previlege_area.update(req.body, { where: { id: id } });
					return apiResponse.successResponse(
						res,
						'previlege area successfully updated.'
					);
				} else {
					return apiResponse.ErrorResponse(res, 'No data found');
				}
			} else {
				return apiResponse.ErrorResponse(res, 'name missing');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to create previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.updateprevilegeurl = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.name && req.body.url && req.body.previlege_area_id) {
				const if_exist = await Previlege_url.findOne({ where: { id: id } });
				if (if_exist) {
					await Previlege_url.update(req.body, { where: { id: id } });
					return apiResponse.successResponse(
						res,
						'previlege url successfully updated.'
					);
				} else {
					return apiResponse.ErrorResponse(res, 'No data found');
				}
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name/url/previlege_area_id missing'
				);
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to create previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.deleteprevilegearea = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			const if_exist = await Previlege_area.findOne({ where: { id: id } });
			if (if_exist) {
				await Previlege_area.destroy({ where: { id: id } });
				return apiResponse.successResponse(
					res,
					'previlege area successfully deleted.'
				);
			} else {
				return apiResponse.ErrorResponse(res, 'No data found');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to delete previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteprevilegeurl = async (req, res) => {
	try {
		const id = req.params.id;
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			const if_exist = await Previlege_url.findOne({ where: { id: id } });
			if (if_exist) {
				await Previlege_url.destroy({ where: { id: id } });
				return apiResponse.successResponse(
					res,
					'previlege url successfully deleted.'
				);
			} else {
				return apiResponse.ErrorResponse(res, 'No data found');
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to delete previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getrolebyid = async (req, res) => {
	try {
		const role_id = req.params.id;
		const role_data = await User_role.findOne({ where: { id: role_id } });
		if (role_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				role_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleterolebyid = async (req, res) => {
	try {
		const role_id = req.params.id;
		const role_data = await User_role.findOne({ where: { id: role_id } });
		if (role_data) {
			await User_role.destroy({ where: { id: role_id } });
			return apiResponse.successResponse(res, 'Data successfully deleted.');
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createprevilegeurl = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.name && req.body.url && req.body.previlege_area_id) {
				await Previlege_url.create(req.body);
				return apiResponse.successResponse(
					res,
					'previlege area successfully created.'
				);
			} else {
				return apiResponse.ErrorResponse(
					res,
					'name/previlege_area_id/url missing'
				);
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to create previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createprevilegetable = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.user_role_id && req.body.previlege_url_id) {
				if (req.body.previlege_url_id.length > 0) {
					for (i = 0; i < req.body.previlege_url_id.length; i++) {
						const check_if_exist = await Previlege_table.findOne({
							where: {
								user_role_id: req.body.user_role_id,
								previlege_url_id: req.body.previlege_url_id[i],
							},
						});
						if (check_if_exist) {
						} else {
							await Previlege_table.create({
								user_role_id: req.body.user_role_id,
								previlege_url_id: req.body.previlege_url_id[i],
								permission: true,
							});
						}
					}
				}
				return apiResponse.successResponse(
					res,
					'previlege successfully created.'
				);
			} else {
				return apiResponse.ErrorResponse(
					res,
					'user_role_id/previlege_url_id missing'
				);
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to create previlege area.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deleteprevilegetable = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		if (user_data.role_id && user_data.role_id === 1) {
			if (req.body.user_role_id && req.body.previlege_url_id) {
				if (req.body.previlege_url_id.length > 0) {
					for (i = 0; i < req.body.previlege_url_id.length; i++) {
						await Previlege_table.destroy({
							where: {
								user_role_id: req.body.user_role_id,
								previlege_url_id: req.body.previlege_url_id[i],
							},
						});
					}
				}

				return apiResponse.successResponse(
					res,
					'previlege successfully deleted.'
				);
			} else {
				return apiResponse.ErrorResponse(
					res,
					'user_role_id/previlege_url_id missing'
				);
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'You have no permission to delete previlege.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getprevilegetable = async (req, res) => {
	try {
		const role_id = req.params.id;
		const user_data = await Previlege_table.findAll({
			include: [Previlege_url],
			where: { user_role_id: role_id },
			order: [[{ model: Previlege_url }, 'id', 'ASC']],
		});
		if (user_data.length > 0) {
			return apiResponse.successResponseWithData(res, 'Data found', user_data);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getprevilegetablebyuserid = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		const user_data = await User.findOne({ where: { id: userId } });
		let previlege_module = [];
		let previlege_data = [];
		if (user_data.role_id) {
			previlege_data = await Previlege_table.findAll({
				include: [Previlege_url],
				where: { user_role_id: user_data.role_id },
			});
			if (user_data.role_id === 1) {
				previlege_data = await Previlege_url.findAll();
				for (i = 0; i < previlege_data.length; i++) {
					previlege_module.push(previlege_data[i].name);
				}
			} else {
				for (i = 0; i < previlege_data.length; i++) {
					previlege_module.push(previlege_data[i].Previlege_url.name);
				}
			}
		}
		return apiResponse.successResponseWithData(
			res,
			'Data fetch success.',
			previlege_module
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Copy user role:
exports.copyUserRole = async (req, res) => {
	try {
		const role_id = req.params.id;
		const role_data = await User_role.findOne({ where: { id: role_id } });

		if (role_data) {
			// Get the maximum ID from the User_role table
			const maxIdResult = await User_role.max('id');
			const maxId = maxIdResult || 0;

			// Increment the last counter in the name
			const newName = incrementLastCounter(role_data.name, maxId);

			// Create a new role object with the incremented name
			const newRole = {
				name: newName,
				permission: role_data.permission,
				previlege_id: role_data.previlege_id,
			};

			// Insert the new role into the database
			const createdRole = await User_role.create(newRole);

			// Find the previlege_url_id values from Previlege_table using user_role_id
			const previlegeData = await Previlege_table.findAll({
				where: { user_role_id: role_id },
			});

			if (previlegeData && previlegeData.length > 0) {
				// Create an array to store the new entries for Previlege_table
				const newPrevilegeEntries = previlegeData.map((previlege) => ({
					previlege_url_id: previlege.previlege_url_id,
					user_role_id: createdRole.id,
					permission: 1,
				}));

				// Insert all new entries into the Previlege_table
				await Previlege_table.bulkCreate(newPrevilegeEntries);

				return apiResponse.successResponse(
					res,
					'Role copied and inserted successfully.'
				);
			} else {
				return apiResponse.ErrorResponse(res, 'No matching previlege found.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching role found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Helper function to increment the last counter in the name
function incrementLastCounter(name, maxId) {
	const parts = name.split(' ');
	const lastPart = parts[parts.length - 1];
	const counter = parseInt(lastPart, 10);

	if (!isNaN(counter)) {
		const incrementedCounter = counter + 1;
		parts[parts.length - 1] = incrementedCounter.toString();
		return parts.join(' ');
	}

	// If the last part is not a valid counter, add the maxId to the name
	return `${name} ${maxId + 1}`;
}

// Export Role
// exports.roleExport = async (req, res) => {
// 	try {
// 		const role_id = req.params.id;
// 		const role_data = await User_role.findOne({ where: { id: role_id } });

// 		if (role_data) {
// 			const previlegeData = await Previlege_table.findAll({
// 				where: { user_role_id: role_id },
// 			});

// 			if (previlegeData && previlegeData.length > 0) {
// 				// Save the result data in a JSON file
// 				const filename = role_data.name;
// 				const jsonData = JSON.stringify(previlegeData, null, 2);
// 				const filePath = path.join(__dirname, '../uploads/exported_role_file', `${filename}.json`);
// 				fs.writeFileSync(filePath, jsonData);

// 				return apiResponse.successResponse(res, 'File export successfully!');
// 			} else {
// 				return apiResponse.ErrorResponse(res, 'No matching privilege found.');
// 			}
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No matching role found.');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };

exports.roleExport = async (req, res) => {
	try {
		const role_id = req.params.id;
		const role_data = await User_role.findOne({ where: { id: role_id } });

		if (role_data) {
			const previlegeData = await Previlege_table.findAll({
				where: { user_role_id: role_id },
			});

			if (previlegeData && previlegeData.length > 0) {
				// Prepare the data for Excel file
				const jsonData = JSON.parse(JSON.stringify(previlegeData));
				const worksheet = xlsx.utils.json_to_sheet(jsonData);
				const workbook = xlsx.utils.book_new();
				xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

				// Save the Excel file
				const filename = role_data.name;
				const userHomeDir = os.homedir();
				const filePath = path.join(
					userHomeDir,
					'Downloads',
					`${filename}.xlsx`
				);
				// const filePath = path.join(__dirname, '../uploads/exported_role_file', `${filename}.xlsx`);
				xlsx.writeFile(workbook, filePath);

				return apiResponse.successResponse(
					res,
					'File export successfully in Download Folder'
				);
			} else {
				return apiResponse.ErrorResponse(res, 'No matching privilege found.');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching role found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//   Import Role
exports.roleImport = async (req, res) => {
	try {
		if (req.file === undefined) {
			return res.status(400).send('Please upload an Excel file!');
		}
		let filePath =
			base_dir_config.base_dir +
			'uploads/excel_file/' +
			req.file.filename;

		const rows = await readXlsxFile(filePath);
		const headers = rows[0];

		// Remove header row
		rows.shift();

		const previlegeData = rows.map((row) => {
			let data = {};
			headers.forEach((header, index) => {
				data[header] = row[index];
			});
			return data;
		});

		const existingPrevilegeDatas = await Previlege_table.findAll({
			where: {
				user_role_id: {
					[Op.in]: previlegeData.map((role) => role.user_role_id),
				},
			},
		});

		const inserts = [];

		previlegeData.forEach((role) => {
			const existingPrevilegeData = existingPrevilegeDatas.find(
				(p) =>
					p.user_role_id === role.user_role_id &&
					p.previlege_url_id === role.previlege_url_id
			);

			if (!existingPrevilegeData) {
				inserts.push({
					user_role_id: role.user_role_id,
					previlege_url_id: role.previlege_url_id,
					permission: 1,
				});
			}
		});

		await Previlege_table.bulkCreate(inserts);

		return apiResponse.successResponseWithData(
			res,
			'File import successfully!'
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//   Import Role by id
exports.roleImportById = async (req, res) => {
	try {
		if (req.file === undefined) {
			return res.status(400).send('Please upload an Excel file!');
		}
		let filePath =
			base_dir_config.base_dir +
			'uploads/excel_file/' +
			req.file.filename;

		const role_id = req.params.id;

		const rows = await readXlsxFile(filePath);
		const headers = rows[0];

		// Remove header row
		rows.shift();

		const previlegeData = rows.map((row) => {
			let data = {};
			headers.forEach((header, index) => {
				data[header] = row[index];
			});
			return data;
		});

		const existingPrevilegeDatas = await Previlege_table.findAll({
			where: { user_role_id: role_id },
		});

		const inserts = [];
		const deletes = [];

		existingPrevilegeDatas.forEach((existingPrevilegeData) => {
			const match = previlegeData.find(
				(role) =>
					role.previlege_url_id === existingPrevilegeData.previlege_url_id
			);

			if (!match) {
				deletes.push(existingPrevilegeData.id);
			}
		});

		previlegeData.forEach((role) => {
			const existingPrevilegeData = existingPrevilegeDatas.find(
				(p) => p.previlege_url_id === role.previlege_url_id
			);

			if (!existingPrevilegeData) {
				inserts.push({
					user_role_id: role_id,
					previlege_url_id: role.previlege_url_id,
					permission: 1,
				});
			}
		});

		await Previlege_table.destroy({
			where: { id: deletes },
		});

		await Previlege_table.bulkCreate(inserts);

		return apiResponse.successResponseWithData(
			res,
			'File import successfully!'
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};


// Export URL Previlege Table data
exports.urlTableExport = async (req, res) => {
	try {
		const previlegeData = await Previlege_url.findAll({});
		console.log('==============================')
		console.log(previlegeData)
		if (previlegeData && previlegeData.length > 0) {
			// Prepare the data for Excel file
			const jsonData = JSON.parse(JSON.stringify(previlegeData));
			const worksheet = xlsx.utils.json_to_sheet(jsonData);
			const workbook = xlsx.utils.book_new();
			xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

			// Save the Excel file
			const filename = 'previlege_url';
			const userHomeDir = os.homedir();
			const filePath = path.join(
				userHomeDir,
				'Downloads',
				`${filename}.xlsx`
			);
			// const filePath = path.join(__dirname, '../uploads/exported_role_file', `${filename}.xlsx`);
			xlsx.writeFile(workbook, filePath);

			return apiResponse.successResponse(
				res,
				'File export successfully in Download Folder'
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching privilege found.');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Export URL Previlege Table data
exports.urlTableImport = async (req, res) => {
	try {
		if (req.file === undefined) {
			return res.status(400).send('Please upload an excel file!');
		}
		let filePath =
			base_dir_config.base_dir +
			'uploads/excel_file/' +
			req.file.filename;

		const rows = await readXlsxFile(filePath);

		if (rows.length === 0) {
			return res.status(400).send('The uploaded file is empty!');
		}

		const headers = rows[0];
		rows.shift(); // Remove header row

		const previlegeUrlData = rows.map((row) => {
			let data = {};
			headers.forEach((header, index) => {
				data[header] = row[index];
			});
			return data;
		});

		// Disable foreign key checks
		await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

		await Previlege_url.destroy({ truncate: true });

		const inserts = previlegeUrlData.map((url) => ({
			id: url.id,
			name: url.name,
			url_order: url.url_order,
			previlege_area_id: url.previlege_area_id,
			url: url.url
		}));

		await Previlege_url.bulkCreate(inserts);

		// Re-enable foreign key checks
		await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

		return apiResponse.successResponseWithData(
			res,
			'File import successfully!'
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
