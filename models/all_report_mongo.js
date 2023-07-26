const mongoose = require('mongoose');

const allReportLogSchema = new mongoose.Schema(
	{
		user_id: String,
		datetime: Date,
		ip: String,
		report_name: String,
		// alldata: [Object]
	},
	{ timestamps: true, versionKey: false }
);

const allReportLog = mongoose.model('allReportLog', allReportLogSchema);

module.exports = allReportLog;
