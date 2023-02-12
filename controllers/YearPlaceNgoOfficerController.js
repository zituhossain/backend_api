const apiResponse = require('../helpers/apiResponse');
const { years, year_place_ngo_officer, officers_heading_description, Place, Officer, Ngo, sequelize, Profile_type, officer_profile_heading } = require('../models');

const checkUserRoleByPlace = require('./globalController');


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
        const title_id = req.params.id;
        const [results, metadata] = await sequelize.query(`SELECT officers_heading_descriptions.*,officer_profile_headings.*,year_place_ngo_officers.place_id,division_id,district_id
        FROM officers_heading_descriptions
        LEFT JOIN officer_profile_headings ON officer_profile_headings.id = officers_heading_descriptions.heading_id
        LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.id = officers_heading_descriptions.ypno_id
        LEFT JOIN Places ON Places.id = year_place_ngo_officers.place_id
        WHERE ypno_id = ${title_id}
        ORDER BY type,view_sort`)
        
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
                headingsList.length > 0 && headingsList.map(async (res, index) => {
                    const description = {
                        ypno_id: ypno?.dataValues?.id,
                        heading_id: res.id,
                        desc: headingsValueList[index]?.headings_value,
                    }
                    await officers_heading_description.create(description);

                })

                console.log('ypno', ypno)
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
                officers_heading_description.destroy({ where: { ypno_id: condition_id } })
                const headingsList = req.body.headingsList;
                const headingsValueList = req.body.headingsValueList;
                console.log(headingsValueList);
                headingsList.length > 0 && headingsList.map(async (res, index) => {
                    const description = {
                        ypno_id: condition_id,
                        heading_id: res.id,
                        desc: headingsValueList[index]?.headings_value?headingsValueList[index]?.headings_value:'',
                    }
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
        query = `where year = (SELECT max(year) FROM Ngo_place_info npi) and`+query  

        const [results, metadata] = await sequelize.query(`SELECT * FROM Ngo_place_info ` + query);



        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}