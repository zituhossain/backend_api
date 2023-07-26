const apiResponse = require('../helpers/apiResponse');
const allReportLog = require('../models/all_report_mongo');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.reportLog = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const decodedToken = jwt.verify(token, secret);
	const userId = decodedToken._id;
	try {
		const reportData = {
			user_id: userId,
			report_name: req.body.report_name,
			datetime: new Date(),
			ip: req.header('x-forwarded-for') || req.socket.remoteAddress,
			// alldata: [],
		};

		// Insert the Data in MongoDB
		const log = new allReportLog(reportData);

		await log.save((err) => {
			if (err) {
				console.error(err);
			} else {
				console.log('Data successfully inserted into MongoDB');
			}
		});

		return apiResponse.successResponse(res, 'Log Created Successfully!.');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllReportLogData = async (req, res) => {
	try {
		const log = await allReportLog.find({});

		// Find user name
		const userData = await User.findAll({
			attributes: ['id', 'username'],
		});

		// Combine the data into an object
		const combinedData = log.map((data) => ({
			id: data._id,
			report_name: data.report_name,
			username:
				userData.find((user) => user.id == data.user_id)?.username ?? null,
			ip: data.ip,
			dataTime: data.datetime,
		}));

		// Return the combined data in the API response
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			combinedData
		);
	} catch (e) {
		res.json({ Error: `Error is ${e}` });
	}
};
