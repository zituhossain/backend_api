const apiResponse = require('../helpers/apiResponse');
const allReportLog = require('../models/all_report_mongo');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.reportLog = async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken._id;
    try {
        const reportData = {
            user_id: userId,
            report_name: 'Report Master',
            datetime: new Date(),
            ip: req.header('x-forwarded-for') || req.socket.remoteAddress,
            alldata: []
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

        return apiResponse.successResponse(
            res,
            'all_data fetch successfully.'
        );
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
}