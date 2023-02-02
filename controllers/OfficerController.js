const apiResponse = require('../helpers/apiResponse');
const { Officer } = require('../models');

exports.createofficer = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/officer/${req.file.filename}`
		req.body.image = filePath;
	}
	try {
		if (req.body.name && req.body.email && req.body.phone && req.body.address) {
			const officer_data = await Officer.findOne({ where: { name: req.body.name } })
			if (officer_data) {
				return apiResponse.ErrorResponse(res, "NGO officer already found in database")
			} else {
				req.body.status = 'active';
				await Officer.create(req.body)
				return apiResponse.successResponse(res, "Data successfully saved.")
			}

		} else {
			return apiResponse.ErrorResponse(res, 'name/address/phone/email missing')
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.getallofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll();
		if (officer_data) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", officer_data)
		} else {
			return apiResponse.ErrorResponse(res, "Officer table is empty.")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.getofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", officer_data)
		} else {
			return apiResponse.ErrorResponse(res, "No matching query found")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.deleteofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			await Officer.update({ status: "deleted" }, { where: { id: officer_id } });
			return apiResponse.successResponse(res, "Data successfully deleted.")
		} else {
			return apiResponse.ErrorResponse(res, "No matching query found")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.activeofficerbyid = async (req, res) => {
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			await Officer.update({ status: "active" }, { where: { id: officer_id } });
			return apiResponse.successResponse(res, "Data successfully activated.")
		} else {
			return apiResponse.ErrorResponse(res, "No matching query found")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.updateofficerbyid = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/officer/${req.file.filename}`
		req.body.image = filePath;
	}
	try {
		const officer_id = req.params.id;
		const officer_data = await Officer.findOne({ where: { id: officer_id } });
		if (officer_data) {
			if (req.body.name && req.body.email && req.body.phone && req.body.address) {
				if (req.body.image === 'null') {
					await Officer.update({ name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address }, { where: { id: officer_id } });
				} else {
					await Officer.update(req.body, { where: { id: officer_id } });
				}
				return apiResponse.successResponse(res, "Data successfully updated.")
			} else {
				return apiResponse.ErrorResponse(res, 'name/address/phone/email missing')
			}
		} else {
			return apiResponse.ErrorResponse(res, "No matching query found")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}

exports.getactiveofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll({ where: { status: 'active' } });
		if (officer_data) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", officer_data)
		} else {
			return apiResponse.ErrorResponse(res, "No active officer found.")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}
exports.getdeletedofficer = async (req, res) => {
	try {
		const officer_data = await Officer.findAll({ where: { status: 'deleted' } });
		if (officer_data) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", officer_data)
		} else {
			return apiResponse.ErrorResponse(res, "No deactive officer found.")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}