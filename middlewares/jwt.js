const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const apiResponse = require('../helpers/apiResponse');
const IP = require('ip');
const {blacklist_ip,User,Previlege_url,Previlege_table} = require('../models');
const { Op } = require("sequelize");


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

// module.exports = authenticate;

module.exports = async(req, res, next) => {
	try {
		// console.log(req.originalUrl)
		let ipAddress = IP.address();
		ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress
		// console.log("ip: ",ipAddress);
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		if (userId && decodedToken.phone === '') {
			throw 'Invalid user ID';
		} else {
			const user_data = await User.findOne({where:{id: userId}})
			if(user_data.status!=='active'){
				return apiResponse.unauthorizedResponse(res,"User is not activated to authorize.")
			}
			if(user_data.role_id && user_data.role_id === 1){
				// console.log("super user");
				next();
			}else{
				let block_list_check = await blacklist_ip.findAll({where:{[Op.and]:[{status: 'block'},{user_ip:ipAddress}]}})
				if(block_list_check.length > 0){
					return apiResponse.unauthorizedResponse(res, 'You are not authorized.Your Ip is blocked');
				}else{
					// next();
					const url_data = await Previlege_url.findOne({where: {url: req.originalUrl}})
					if(url_data){
						const url_table_data = await Previlege_table.findOne({where: {user_role_id: user_data.role_id,previlege_url_id: url_data.id}})
						if(url_table_data){
							next();
						}else{
							return apiResponse.unauthorizedResponse(res,"You have no access on this url")
						}
					}else{
						return apiResponse.unauthorizedResponse(res,"You have no access on this url")
					}
				}
			}
		}
	} catch(err) {
		console.log(err.message);
		return apiResponse.unauthorizedResponse(res, 'You are not authorized.');
	}
};
