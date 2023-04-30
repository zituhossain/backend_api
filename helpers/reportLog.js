exports.getUserId = (req) => {
	const jwt = require('jsonwebtoken');
	const secret = process.env.JWT_SECRET;

	const token = req.headers.authorization.split(' ')[1];
	const decodedToken = jwt.verify(token, secret);
	const userId = decodedToken._id;

	return userId;
};

exports.generateReportInfo = (userId, data, request) => {
	return {
		user_id: userId,
		dateTime: new Date().toLocaleString(),
		ip: request.socket.remoteAddress,
		data: data,
	};
};
