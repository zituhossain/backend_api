const apiResponse = require('../helpers/apiResponse');
const { years, year_place_ngo_officer, officers_heading_description, Place, Officer, Ngo, sequelize, Profile_type, officer_profile_heading } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 

const initVector = crypto.randomBytes(16);
const checkUserRoleByPlace = require('./globalController');


exports.deleteYearPlaceNgoofficer = async (req, res) => {
    const row_id = req.params.id;
    const allOverallTitle = await year_place_ngo_officer.findOne({
        where: {id: row_id}
    });
    if (allOverallTitle) {
        await year_place_ngo_officer.destroy({where: {id:row_id}});
        await officers_heading_description.destroy({where: {officer_id:allOverallTitle.officer_id}});
        return apiResponse.successResponse(res, "data successfully deleted")
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}
exports.fetchYearPlaceNgoofficer = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let roleByplace = await checkUserRoleByPlace(token)
    let arr = [];
    if (roleByplace.place.length > 0) {
        arr.push({ place_id: roleByplace.place })
    }
    const allOverallTitle = await year_place_ngo_officer.findAll({
        include: [Place, Officer, Ngo, years],
        where: arr
    });
    if (allOverallTitle) {
        return apiResponse.successResponseWithData(res, "year_place_ngo_officer fetch successfully.", allOverallTitle)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}
exports.fetchYearPlaceNgoofficerFront = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const allOverallTitle = await Profile_type.findAll({
        include: [officer_profile_heading],
        required: false
    });
    if (allOverallTitle) {
        return apiResponse.successResponseWithData(res, "year_place_ngo_officer fetch successfully.", allOverallTitle)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.getYearPlaceNgoofficerbyid = async (req, res) => {
    try {
        const title_id = req.params.id;
        const title_data = await year_place_ngo_officer.findOne({ where: { id: title_id }, include: { years } });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getNgoOfficerHeadings = async (req, res) => {
    try {
        const officer_id = req.params.officer_id;
        const year_id = req.params.year_id;
        const [results, metadata] = await sequelize.query(`SELECT officers_heading_descriptions.*,officer_profile_headings.*,year_place_ngo_officers.place_id,division_id,district_id
        FROM officers_heading_descriptions
        LEFT JOIN officer_profile_headings ON officer_profile_headings.id = officers_heading_descriptions.heading_id
        LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.year_id = officers_heading_descriptions.year_id 
        AND year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id
        LEFT JOIN Places ON Places.id = year_place_ngo_officers.place_id
        WHERE year_place_ngo_officers.year_id = ${year_id} AND year_place_ngo_officers.officer_id =${officer_id}
        group by officer_profile_headings.id ORDER BY TYPE,view_sort`)

        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getNgoOfficerExists = async (req, res) => {
    try {
        const officer_id = req.params.officer_id;
        const year_id = req.params.year_id;
        const [results, metadata] = await sequelize.query(`SELECT officers_heading_descriptions.*
        FROM officers_heading_descriptions
        LEFT JOIN year_place_ngo_officers on officers_heading_descriptions.officer_id = year_place_ngo_officers.officer_id AND officers_heading_descriptions.year_id = year_place_ngo_officers.year_id
        WHERE year_place_ngo_officers.officer_id = ${officer_id} and year_place_ngo_officers.year_id=${year_id}`)
        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getAllCountInformation = async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(`select sum(total_population) as total_population,sum(male) as total_male, SUM(female) as total_female,(select count(*) from Places) as total_places,(select count(*) from Ngos) as total_ngos,(SELECT COUNT(*) from Officers) as total_officer,(SELECT COUNT(*) from Officers where gender = 1) as male_officer,(SELECT COUNT(*) from Officers where gender = 2) as female_officer from population_year_places where year_id = (select id from years order by id DESC LIMIT 1,1)`)
        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getYearPlaceNgoOfficebyPlace = async (req, res) => {
    try {
        const placeid = req.params.placeid;
        const title_data = await year_place_ngo_officer.findOne({ where: { place_id: placeid }, include: [years] });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getYearPlaceNgoOfficebyYear = async (req, res) => {
    try {
        const placeid = req.params.year;
        const id = req.params.id;
        console.log("id", id)
        const title_data = await year_place_ngo_officer.findOne({ include: [Officer, Ngo, years], where: { year_id: placeid, ngo_id: id } });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
var generateHash = (value) => {
	// let salt = bcrypt.genSaltSync();
	// return bcrypt.hashSync(value, salt);
    const Securitykey = crypto.randomBytes(32);

    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(value, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    return encryptedData

}

exports.createYearPlaceNgoofficer = async (req, res) => {
    try {
        const get_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, ngo_id: req.body.ngo_id } });
        if (!get_data) {
            if (Object.keys(req.body).length === 0) {
                return apiResponse.ErrorResponse(res, 'placeID missing')
            } else {
                const ypno = await year_place_ngo_officer.create(req.body);
                const headingsList = req.body.headingsList;
                const headingsValueList = req.body.headingsValueList;
                const [results, metadata] = await sequelize.query(`SELECT officers_heading_descriptions.*
        FROM officers_heading_descriptions LEFT JOIN year_place_ngo_officers on officers_heading_descriptions.officer_id = year_place_ngo_officers.officer_id AND officers_heading_descriptions.year_id = year_place_ngo_officers.year_id  WHERE year_place_ngo_officers.officer_id = ${req.body.officer_id} and year_place_ngo_officers.year_id=${req.body.year_id}`)
        // console.log(results);
                if (results.length === 0) {
                    headingsList.length > 0 && headingsList.map(async (res, index) => {
                        let get_desc = generateHash(headingsValueList[index]?.headings_value);
                        const description = {
                            // ypno_id: ypno?.dataValues?.id,
                            heading_id: res.id,
                            officer_id: req.body.officer_id,
                            year_id: req.body.year_id,
                            desc: get_desc,
                        }
                        await officers_heading_description.create(description);

                    })
                }
                // console.log('ypno', ypno)
                return apiResponse.successResponse(res, 'Year Place Ngo Officer saved successfully.')
            }
        } else {
            return apiResponse.ErrorResponse(res, "Same Year Same Place Same NGO Failed")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.updateoveralltitlebyid = async (req, res) => {
    try {
        const condition_id = req.params.id;
        const condition_data = await year_place_ngo_officer.findOne({ where: { id: condition_id } });
        if (condition_data) {
            if (req.body.place_id) {
                await year_place_ngo_officer.update(req.body, { where: { id: condition_id } });
                officers_heading_description.destroy({ where: { officer_id: req.body.officer_id,year_id: req.body.year_id } })
                const headingsList = req.body.headingsList;
                const headingsValueList = req.body.headingsValueList;
                headingsList.length > 0 && headingsList.map(async (res, index) => {
                    const description = {
                        // ypno_id: condition_id,                        
                        officer_id: req.body.officer_id,
                        year_id: req.body.year_id,
                        heading_id: res.id,
                        desc: headingsValueList[index]?.headings_value ? headingsValueList[index]?.headings_value : '',
                    }
                    console.log(description);
                    await officers_heading_description.create(description);

                })
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, 'description missing')
            }
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getkormibyxid = async (req, res) => {
    try {
        const id = req.params.id;
        const condition_name = req.params.condition;
        let query = '';
        if (condition_name === 'place') {
            query = `Places.id`
        } else if (condition_name === 'division') {
            query = `Places.division_id`
        } else if (condition_name === 'district') {
            query = `Places.district_id`
        }
        const [results, metadata] = await sequelize.query(`select Places.name,Officers.name as officer_name,Places.id as place_id,Officers.image from Places LEFT JOIN year_place_ngo_officers ypno on ypno.place_id = Places.id LEFT JOIN Officers on Officers.id = ypno.officer_id where ${query} = ${id} GROUP BY Places.id`)
        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.getkormitopbyxid = async (req, res) => {
    try {
        const id = req.params.id;
        const condition_name = req.params.condition;
        let query = '';
        if (condition_name === 'place') {
            query = ` place_id=${id}`
        } else if (condition_name === 'division') {
            query = ` division_id=${id}`
        } else if (condition_name === 'district') {
            query = ` district_id=${id}`
        }
        query = `where year = (SELECT max(year) FROM Ngo_place_info npi) and` + query

        const [results, metadata] = await sequelize.query(`SELECT * FROM Ngo_place_info ` + query + ` GROUP BY officer_name`);



        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}