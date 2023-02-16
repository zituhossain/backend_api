const apiResponse = require('../helpers/apiResponse');
const { Officer,sequelize } = require('../models');

exports.createofficer = async (req, res) => {
	if (req.file) {
		const filePath = `uploads/officer/${req.file.filename}`
		req.body.image = filePath;
	}
	try {
		if (req.body.name) {
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

exports.getOfficerInfoById = async (req, res) => {
	try {
		const [results, metadata]  = await sequelize.query(`select * from Ngo_place_info where officer_id = '${req.params.officer_id}' and place_id =${req.params.place_id}`
);
		if (results) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
		} else {
			return apiResponse.ErrorResponse(res, "Officer table is empty.")
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message)
	}
}
exports.getOfficerHeadingById = async (req, res) => {
	const officer_id = req.params.id;
	const place_id = req.params.place_id;

	try {
		const [results, metadata]  = await sequelize.query(`		
		select GROUP_CONCAT(DISTINCT(heading)) as heading, GROUP_CONCAT(DISTINCT(officers_heading_descriptions.desc)) as descc,Profile_types.type,Profile_types.id as profile_type_id,officers_heading_descriptions.officer_id from officer_profile_headings LEFT JOIN officers_heading_descriptions on officers_heading_descriptions.heading_id = officer_profile_headings.id LEFT join Profile_types on Profile_types.id = officer_profile_headings.type LEFT JOIN year_place_ngo_officers on year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.year_id WHERE officers_heading_descriptions.officer_id=${officer_id} and year_place_ngo_officers.place_id = ${place_id} and year_place_ngo_officers.year_id = (select MAX(id) from years) group by Profile_types.id
		`);
		if (results) {
			return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
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
			if (req.body.name) {
				if (req.body.image === 'null') {
					await Officer.update({ name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address,nid:req.body.nid,nid:req.body.nid,educational_qualification: req.body.educational_qualification,financial_activities:req.body.financial_activities,gender:req.body.gender,status:req.body.status }, { where: { id: officer_id } });
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