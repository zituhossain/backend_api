const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const apiResponse = require('../helpers/apiResponse');
const IP = require('ip');
const {
	blacklist_ip,
	User,
	Previlege_url,
	Previlege_table,
} = require('../models');
const { Op } = require('sequelize');
const { createLogger, format, transports } = require('winston');
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;

const userModel = require('../models/mongo_models');

var logger = createLogger({
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console({}),
		new transports.File({ filename: 'log/' + currentDate + '.log' }),
	],
});

const authenticate = (roles = []) => {
	if (typeof roles === 'string') {
		roles = [roles];
	}

	return (req, res, next) => {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const token = authHeader.split(' ')[1];
			let isAllowed = false;

			return jwt.verify(token, secret, (err, user) => {
				if (err) {
					return apiResponse.unauthorizedResponse(
						res,
						'Your token is invalid. Please make sure you have a valid auth token.'
					);
				}

				if (roles.length && !roles.includes(user.role)) {
					return apiResponse.unauthorizedResponse(
						res,
						'You are not authorized to use this api.'
					);
				}

				req.user = user;
				next();
			});
		} else {
			return apiResponse.unauthorizedResponse(res, 'You are not authorized.');
		}
	};
};
// function checkurl(value) {
// 	value = value.split("/")

// 	if (parseInt(value[value.length - 1])) {
// 		value[value.length - 1] = ":id"
// 		value = value.join("/")
// 		return {status: true,url: value}
// 	} else {
// 		value = value.join("/")
// 		return {status: false,url: value}
// 	}
// }

function checkurl(value) {
	const segments = value.split('/');

	if (
		segments.length >= 3 && parseInt(segments[segments.length - 2])
		&& parseInt(segments[segments.length - 1])
	) {
		segments[segments.length - 2] = ':condition';
		segments[segments.length - 1] = ':id';
		value = segments.join('/');
		return { status: true, url: value };
	} else if (parseInt(segments[segments.length - 1])) {
		segments[segments.length - 1] = ':id';
		value = segments.join('/');
		return { status: true, url: value };
	} else {
		value = segments.join('/');
		return { status: false, url: value };
	}
}

// function checkurl(value) {
// 	const segments = value.split('/');
// 	const conditionSegment = segments[segments.length - 2];
// 	const idSegment = segments[segments.length - 1];

// 	const conditionRegex = /^[a-zA-Z]+$/; // Regular expression to match alphabetic characters
// 	console.log('seg=', segments[segments.length - 2]);
// 	if (
// 		segments.length >= 3 &&
// 		conditionRegex.test(conditionSegment) &&
// 		/^\d+$/.test(idSegment)
// 	) {
// 		segments[segments.length - 2] = ':condition';

// 		segments[segments.length - 1] = ':id';
// 	} else if (/^\d+$/.test(idSegment)) {
// 		segments[segments.length - 1] = ':id';
// 	}

// 	value = segments.join('/');
// 	return { status: true, url: value };
// }

const save_to_mongo = async (body) => {
	const user = new userModel(body);
	// const users = await userModel.find({});
	// console.log(users)

	try {
		await user.save();
		//   console.log("mongo saved")
	} catch (error) {
		console.log('mongo save error: ', error.message);
	}
};

function createLog(data) {
	logger.info(data);
	// save_to_mongo(data);
}
// module.exports = authenticate;

module.exports = async (req, res, next) => {
	let ipAddress = IP.address();
	ipAddress =
		req.headers['x-forwarded-for'] ||
		req.headers['x-real-ip'] ||
		req.socket.remoteAddress;
	// console.log("ip: ",ipAddress);
	const token = req.headers.authorization.split(' ')[1];
	const decodedToken = jwt.verify(token, secret);
	const userId = decodedToken._id;
	const logdata = {
		api_route: req.originalUrl,
		method: req.method,
		body: req.body && Object.keys(req.body).length === 0 ? '' : req.body,
		user_id: userId,
		ip: ipAddress,
	};
	createLog(logdata);
	try {
		// console.log("aaaaaaaaaaaaaaaaaaaaaaaa", req.originalUrl)
		let validate_url = checkurl(req.originalUrl);
		let finalurl = req.originalUrl;
		if (validate_url.status) {
			finalurl = validate_url.url;
		}
		if (userId && decodedToken.phone === '') {
			throw 'Invalid user ID';
		} else {
			const user_data = await User.findOne({ where: { id: userId } });
			if (user_data.status !== 'active') {
				return apiResponse.unauthorizedResponse(
					res,
					'User is not activated to authorize.'
				);
			}
			if (user_data.role_id && user_data.role_id === 1) {
				// console.log("super user");
				next();
			} else {
				let block_list_check = await blacklist_ip.findAll({
					where: { [Op.and]: [{ status: 'block' }, { user_ip: ipAddress }] },
				});
				if (block_list_check.length > 0) {
					return apiResponse.unauthorizedResponse(
						res,
						'You are not authorized.Your Ip is blocked'
					);
				} else {
					// next();
					// const url_data = await Previlege_url.findOne({ where: { url: req.originalUrl } })
					const url_data = await Previlege_url.findOne({
						where: { url: finalurl },
					});
					if (url_data) {
						const url_table_data = await Previlege_table.findOne({
							where: {
								user_role_id: user_data.role_id,
								previlege_url_id: url_data.id,
							},
						});
						if (url_table_data) {
							next();
						} else {
							console.log('url name - ', url_data?.name);
							console.log('url - ', url_data?.url);
							console.log('user_role_id - ', user_data.role_id);
							console.log('url_id - ', url_data.id);
							console.log('------------jwt.js 111----------');
							console.log(finalurl);
							return apiResponse.unauthorizedResponse(
								res,
								'You have no access on this url'
							);
						}
					} else {
						console.log('------------jwt.js 222----------');
						console.log(finalurl);
						console.log('aaaaaaaaaaaaaaaaaaaaaaaa', req.originalUrl);
						return apiResponse.unauthorizedResponse(
							res,
							'You have no access on this url'
						);
					}
				}
			}
		}
	} catch (err) {
		console.log(err.message);
		return apiResponse.unauthorizedResponse(res, 'You are not authorized.');
	}
};
