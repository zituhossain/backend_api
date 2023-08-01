const {
	User,
	Login_attempt,
	blacklist_ip,
	Previlege_table,
	Previlege_url,
} = require('../models');
//helper file to prepare responses.
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const IP = require('ip');
let ipAddress = IP.address();
const { Op } = require('sequelize');
/**
 * User registration.
 *
 *
 * @returns {Object}
 * @param req
 * @param res
 */
function generatePassword(value) {
	let salt = bcrypt.genSaltSync();
	return bcrypt.hashSync(value, salt);
	// const saltRounds = 10;
	// return bcrypt.hashSync(value, saltRounds);
}

function dycryptandmatch(value, hashStoredInDB) {
	const result = bcrypt.compare(value, hashStoredInDB);
	return result;
}
exports.register = async (req, res) => {
	try {
		// const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
		const {
			username,
			firstname,
			lastname,
			password1,
			password2,
			office_id,
			phone,
			role_id,
		} = req.body;
		if (password1 === password2) {
			return apiResponse.ErrorResponse(res, 'Password can not be same');
		} else {
			// req.body.username = firstname + lastname;
			req.body.status = 'pending';
			const user = await User.findOne({
				where: { username: req.body.username },
			});
			if (user) {
				return apiResponse.ErrorResponse(res, 'Duplicate user found');
			} else {
				req.body.password1 = generatePassword(password1);
				req.body.password2 = generatePassword(password2);
				await User.create(req.body);
				return apiResponse.successResponse(res, 'User Creation Success.');
			}
		}
	} catch (err) {
		//throw error in json response with status 500.
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

exports.updateUserByOwn = async (req, res) => {
	try {
		const userId = req.params.id;
		const userData = await User.findOne({ where: { id: userId } });
		const oldDbpPass1 = userData.password1;
		const oldDbpPass2 = userData.password2;
		const {
			username,
			firstname,
			lastname,
			oldpassword1,
			oldpassword2,
			newpassword1,
			newpassword2,
		} = req.body;
		const user = await User.findByPk(userId);

		if (!user) {
			return apiResponse.ErrorResponse(res, 'User not found');
		}

		user.username = username;
		user.firstname = firstname;
		user.lastname = lastname;

		if (newpassword1 || newpassword2) {
			if (newpassword1 === newpassword2) {
				return apiResponse.ErrorResponse(
					res,
					'পাসওয়ার্ড ১ এবং পাসওয়ার্ড ২ একই হতে পারবেনা'
				);
			} else {
				if (newpassword1 !== null || newpassword1 !== '') {
					const passwordmatch = await dycryptandmatch(
						oldpassword1,
						oldDbpPass1
					);
					if (passwordmatch) {
						user.password1 = generatePassword(newpassword1);
					} else {
						return apiResponse.ErrorResponse(res, 'পুরনো পাসওয়ার্ড ১ ভুল');
					}
				}
				if (newpassword2 !== null || newpassword2 !== '') {
					const passwordmatch = await dycryptandmatch(
						oldpassword2,
						oldDbpPass2
					);
					if (passwordmatch) {
						user.password2 = generatePassword(newpassword2);
					} else {
						return apiResponse.ErrorResponse(res, 'পুরনো পাসওয়ার্ড ২ ভুল');
					}
				}
			}
		}

		await user.save();

		return apiResponse.successResponse(res, 'User Update Success.');
	} catch (err) {
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

exports.updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const {
			username,
			firstname,
			lastname,
			office_id,
			phone,
			role_id,
			status,
			password1,
			password2,
		} = req.body;

		const user = await User.findByPk(userId);

		if (!user) {
			return apiResponse.ErrorResponse(res, 'User not found');
		}

		user.username = username;
		user.firstname = firstname;
		user.lastname = lastname;
		user.office_id = office_id;
		user.phone = phone;
		user.role_id = role_id;
		user.status = status;

		if (password1 && password2) {
			if (password1 === password2) {
				return apiResponse.ErrorResponse(res, 'Password can not be same');
			} else {
				if (password1 !== null || password1 !== '')
					user.password1 = generatePassword(password1);
				if (password2 !== null || password2 !== '')
					user.password2 = generatePassword(password2);
			}
		}

		await user.save();

		return apiResponse.successResponse(res, 'User Update Success.');
	} catch (err) {
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

/**
 * User login.
 *
 *
 * @returns {Object}
 * @param req
 * @param res
 */
exports.login = async (req, res) => {
	const { username, password1, password2 } = req.body;
	try {
		const user = await User.findOne({ where: { username: req.body.username } });
		if (user) {
			if (password2 === '') {
				const passwordmatch = await dycryptandmatch(password1, user.password1);
				console.log('passwordmatch', passwordmatch);
				if (passwordmatch) {
					const data = {
						error: false,
						message: 'password is wrong. Enter 2nd password',
					};
					return res.status(200).json(data);
				} else {
					return apiResponse.unauthorizedResponse(
						res,
						'password did not matched'
					);
				}
			} else {
				if (user.status === 'active') {
					const passwordmatch2 = await dycryptandmatch(
						password2,
						user.password2
					);
					if (passwordmatch2) {
						var previlege_table_data = [];
						// if(user.role_id === 1){
						// 	previlege_table_data = await Previlege_url.findAll()
						// }else{
						// 	previlege_table_data = await Previlege_table.findAll({
						// 		include:[Previlege_url],
						// 		where:{user_role_id: user.role_id}
						// 	})
						// }
						let final_array = [];
						for (i = 0; i < previlege_table_data.length; i++) {
							final_array.push(previlege_table_data[i].name);
						}
						let userData = {
							_id: user.id,
							username: user.username,
							phone: user.phone,
							role: user.role_id,
							privilege_url: final_array,
						};
						const jwtPayload = userData;
						const jwtData = {
							expiresIn: process.env.JWT_TIMEOUT_DURATION,
						};
						const secret = process.env.JWT_SECRET;
						const token = jwt.sign(jwtPayload, secret, jwtData);
						try {
							ipAddress =
								req.headers['x-forwarded-for'] ||
								req.headers['x-real-ip'] ||
								req.socket.remoteAddress;
							let attempt_data = await Login_attempt.findOne({
								where: { user_ip: ipAddress },
							});
							if (attempt_data) {
								await Login_attempt.update(
									{ attempt: 1, status: 'end' },
									{
										where: {
											user_ip: ipAddress,
											attempt: 1,
											status: 'running',
										},
									}
								);
								await Login_attempt.update(
									{ attempt: 1, status: 'end' },
									{ where: { user_ip: ipAddress, status: 'error' } }
								);
							} else {
								await Login_attempt.create({
									user_id: user.id,
									user_ip: ipAddress,
									attempt: 1,
									status: 'running',
								});
							}
						} catch (err) {
							console.log('login error: ', err.message);
						}
						return apiResponse.successResponseWithDataNToken(
							res,
							'login successfull.',
							user,
							token
						);
					} else {
						try {
							ipAddress =
								req.headers['x-forwarded-for'] ||
								req.headers['x-real-ip'] ||
								req.socket.remoteAddress;
							let attempt_data = await Login_attempt.findOne({
								where: { user_ip: ipAddress },
							});
							if (attempt_data) {
								let value = true;
								if (
									attempt_data.attempt === 1 &&
									attempt_data.status === 'end'
								) {
									await Login_attempt.update(
										{ attempt: 1, status: 'error' },
										{ where: { id: attempt_data.id } }
									);
									value = false;
								}
								if (attempt_data.attempt === 2) {
									await Login_attempt.update(
										{ attempt: attempt_data.attempt + 1 },
										{ where: { id: attempt_data.id, status: 'error' } }
									);
									await User.update(
										{ status: 'pending' },
										{ where: { id: user.id } }
									);
									await blacklist_ip.create({
										user_id: user.id,
										user_ip: ipAddress,
										status: 'block',
									});
								} else {
									if (value) {
										await Login_attempt.update(
											{ attempt: attempt_data.attempt + 1 },
											{ where: { id: attempt_data.id, status: 'error' } }
										);
									}
								}
							} else {
								await Login_attempt.create({
									user_id: user.id,
									user_ip: ipAddress,
									attempt: 1,
									status: 'error',
								});
							}
						} catch (err) {
							console.log('login error: ', err.message);
						}
						return apiResponse.unauthorizedResponse(
							res,
							'password did not matched'
						);
					}
				} else {
					return apiResponse.unauthorizedResponse(
						res,
						'user is not activated by admin'
					);
				}
			}
		} else {
			return apiResponse.unauthorizedResponse(
				res,
				'No user found in this query'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.deactivateuser = async (req, res) => {
	return apiResponse.successResponse(res, 'user deactivate successfull.');
};
