exports.successResponse = function (res, msg) {
	const data = {
		success: true,
		message: msg,
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	const resData = {
		success: true,
		message: msg,
		data: data,
	};
	return res.status(200).json(resData);
};

exports.successResponseWithDataNToken = function (res, msg, data,token) {
	const resData = {
		success: true,
		message: msg,
		data: data,
		token: token,
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	const resData = {
		error: true,
		message: msg,
		data: data,
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	return res.status(401).json(data);
};
