const apiResponse = require('../helpers/apiResponse');
const {Setting} = require('../models');


exports.createSetting = async (req, res) => {
    try {
        const get_data = await Setting.findOne({ where: { name: req.body.name} });
        // console.log("get_data", get_data)
        // return
        if (!get_data) {
            if (Object.keys(req.body).length === 0) {
                return apiResponse.ErrorResponse(res, 'name missing')
            } else {
                await Setting.create(req.body);
                return apiResponse.successResponse(res, 'settings saved successfully.')
            }
        }else{
            return apiResponse.ErrorResponse(res, "this setting added already") 
        }
    } catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
}

exports.getAllSettings = async (req, res) => {
	try {

		const settingData = await Setting.findAll();
		// Return the combined data in the API response
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			settingData
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateSettingById = async (req, res) => {
	try {
        const id = req.params.id
		const settingData = await Setting.findOne({ where: { id } });
		// Return the combined data in the API response
        if (settingData) {
            await Setting.update(req.body, { where: { id } });
            return apiResponse.successResponse(
                res,
                'previlege area successfully updated.'
            );
        } else {
            return apiResponse.ErrorResponse(res, 'No data found');
        }
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getSettingById = async (req, res) => {
	try {

		const settingData = await Setting.findOne();
		// Return the combined data in the API response
		return apiResponse.successResponseWithData(
			res,
			'Data successfully fetched.',
			settingData
		);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};


exports.deactivateSetting = async (req, res) => {
	const settingsId = req.params.id;
	const setting = await Setting.findOne({ where: { id: settingsId } });
	if (setting) {
		await Setting.update({ value: 0 }, { where: { id: settingsId } });
		return apiResponse.successResponse(res, 'setting deactivate successfull.');
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

exports.activateSetting = async (req, res) => {
	const settingsId = req.params.id;
	const user = await Setting.findOne({ where: { id: settingsId } });
	if (user) {
		await Setting.update({ value: 1 }, { where: { id: settingsId } });		
		return apiResponse.successResponse(res, 'setting activation successfull.');
	} else {
		return apiResponse.ErrorResponse(res, 'No data found');
	}
};

