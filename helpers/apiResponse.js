const { createLogger, format, transports } = require("winston");
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;
const userModel = require("../models/mongo_models");

const save_to_mongo = async (body) => {
    const user = new userModel(body);
	// const users = await userModel.find({});
	// console.log(users)
  
    try {
      await user.save();
	//   console.log("mongo saved")
    } catch (error) {
		console.log("mongo save error: ",error.message)
    }
};


var logger = createLogger({
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console({}),
		new transports.File({ filename: "log/"+currentDate+".log" }),
	],
  });
exports.successResponse = function (res, msg) {
	const data = {
		success: true,
		message: msg,
	};
	logger.info(msg)

	const logdata = {
		body: data,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	const resData = {
		success: true,
		message: msg,
		data: data,
	};
	logger.info(msg)
	const logdata = {
		body: resData,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(200).json(resData);
};

exports.successResponseWithDataNToken = function (res, msg, data,token) {
	const resData = {
		success: true,
		message: msg,
		data: data,
		token: token,
	};
	logger.info(msg)
	const logdata = {
		body: resData,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	logger.error(msg)
	const logdata = {
		body: data,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	logger.error(msg)
	const logdata = {
		body: data,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	const resData = {
		error: true,
		message: msg,
		data: data,
	};
	logger.error(msg)
	const logdata = {
		body: resData,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	const data = {
		error: true,
		message: msg,
	};
	logger.error(msg)
	const logdata = {
		body: data,
		method: msg
	}
	// save_to_mongo(logdata);
	return res.status(401).json(data);
};
