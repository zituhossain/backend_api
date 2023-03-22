const apiResponse = require('../helpers/apiResponse');
const { years, year_place_ngo_officer, officers_heading_description, Place, Officer, Ngo, sequelize, Profile_type, officer_profile_heading, NgoServed } = require('../models');
const CryptoJS = require('crypto-js');
const checkUserRoleByPlace = require('./globalController');


exports.deleteYearPlaceNgoofficer = async (req, res) => {
    const row_id = req.params.id;
    const allOverallTitle = await year_place_ngo_officer.findOne({
        where: { id: row_id }
    });
    if (allOverallTitle) {
        let check_if_exist = year_place_ngo_officer.findAll({
            where: { ngo_id: allOverallTitle.ngo_id, year_id: allOverallTitle.year_id }
        });
        let check_if_exist_officer = await year_place_ngo_officer.findAll({
            raw: true, where: { ngo_id: allOverallTitle.ngo_id, year_id: allOverallTitle.year_id, place_id: allOverallTitle.place_id }
        });
        console.log("check_if_exist_officercheck_if_exist_officer", check_if_exist_officer)
        if (check_if_exist_officer.length == 1) {
            await Place.update({
                ngo_id: null
            }, { where: { id: check_if_exist_officer[0].place_id } });
        }
        if (check_if_exist.length > 1) {

        } else if (check_if_exist.length === 1) {
            await NgoServed.destroy({ where: { ngo_id: allOverallTitle.ngo_id } })
        }
        await year_place_ngo_officer.destroy({ where: { id: row_id } });
        await officers_heading_description.destroy({ where: { officer_id: allOverallTitle.officer_id } });
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
var decryptHash = (value) => {
    // return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(value, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
exports.getNgoOfficerHeadings = async (req, res) => {
    try {
        const officer_id = req.params.officer_id;
        const year_id = req.params.year_id;
        let [results, metadata] = await sequelize.query(`SELECT officers_heading_descriptions.*,officer_profile_headings.*,year_place_ngo_officers.place_id,division_id,district_id
        FROM officers_heading_descriptions
        LEFT JOIN officer_profile_headings ON officer_profile_headings.id = officers_heading_descriptions.heading_id
        LEFT JOIN year_place_ngo_officers ON year_place_ngo_officers.year_id = officers_heading_descriptions.year_id 
        AND year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id
        LEFT JOIN places ON places.id = year_place_ngo_officers.place_id
        WHERE year_place_ngo_officers.year_id = ${year_id} AND year_place_ngo_officers.officer_id =${officer_id}
        group by officer_profile_headings.id ORDER BY TYPE,view_sort`)

        if (results) {
            let final_arr = [];
            for (let i = 0; i < results.length; i++) {
                let decrypted_data = decryptHash(results[i].desc);
                results[i].desc = decrypted_data;
                final_arr.push(results[i])
            }
            console.log("resultsresultsresultsresultsresults", results)
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", final_arr)
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
            let final_arr = [];
            for (let i = 0; i < results.length; i++) {
                let decrypted_data = decryptHash(results[i].desc);
                results[i].desc = decrypted_data;
                final_arr.push(results[i])
            }
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", final_arr)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getAllCountInformation = async (req, res) => {
    try {
        // const [results, metadata] = await sequelize.query(`select sum(total_population) as total_population,sum(male) as total_male, SUM(female) as total_female,(select count(*) from places) as total_places,(select count(*) from ngos) as total_ngos,(SELECT COUNT(*) from officers) as total_officer,(SELECT COUNT(*) from officers where gender = 1) as male_officer,(SELECT COUNT(*) from officers where gender = 2) as female_officer from population_year_places where year_id = (select id from years order by id DESC LIMIT 1,1)`)
        const [results, metadata] = await sequelize.query(`select sum(total_population) as total_population,sum(male) as total_male, SUM(female) as total_female,(select count(*) from places) as total_places,(select count(*) from ngos) as total_ngos,(SELECT COUNT(*) from officers) as total_officer,(SELECT COUNT(*) from officers where gender = 1) as male_officer,(SELECT COUNT(*) from officers where gender = 2) as female_officer from population_year_places where year_id = (select MAX(id) from years)`)
        if (results) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getNgoPopularOfficer = async (req, res) => {
    try {
        //const [results, metadata] = await sequelize.query(`select officers.* from year_place_ngo_officers left join officers on officers.id = year_place_ngo_officers.officer_id where year_place_ngo_officers.year_id =(select id from years order by id DESC LIMIT 1,1) and rank = 1 and year_place_ngo_officers.place_id = ${req.params.id}`)
        const [results, metadata] = await sequelize.query(`select officers.*, ngos.name as ngoname, year_place_ngo_officers.ngo_id from officers left join year_place_ngo_officers on officers.id = year_place_ngo_officers.officer_id left join ngos on year_place_ngo_officers.ngo_id = ngos.id where year_place_ngo_officers.year_id =(select id from years order by id DESC LIMIT 1,1) and rank = 1 and year_place_ngo_officers.place_id = ${req.params.id}`)

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
    // return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
    const passphrase = '123';
    return CryptoJS.AES.encrypt(value, passphrase).toString();

}

exports.createYearPlaceNgoofficer = async (req, res) => {
    try {
        console.log("------------------createYearPlaceNgoofficer-------------------", req.body)
        const rank_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, rank: req.body.rank } });
        console.log("------------------createYearPlaceNgoofficer----------------", rank_data)
        if (!rank_data || req.body.rank !== 1) {
            const get_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, ngo_id: req.body.ngo_id, officer_id: req.body.officer_id } });
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
                            const heading_value = headingsValueList.find(ress => ress.profile_id === res.id)

                            if (heading_value?.headings_value) {
                                let get_desc = generateHash(heading_value?.headings_value);
                                const description = {
                                    // ypno_id: ypno?.dataValues?.id,
                                    heading_id: res.id,
                                    officer_id: req.body.officer_id,
                                    year_id: req.body.year_id,
                                    desc: get_desc,
                                }
                                await officers_heading_description.create(description);
                            }
                        })
                    }
                    // console.log('ypno', ypno)
                    return apiResponse.successResponse(res, 'Year Place Ngo Officer saved successfully.')
                }
            } else {
                return apiResponse.ErrorResponse(res, "Same Year Same Place Same NGO Same Officer Failed")
            }
        } else {
            return apiResponse.ErrorResponse(res, "Same Year Same Place Same Rank Failed")
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
            const rank_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, rank: req.body.rank }, raw: true });
            console.log("------------------createYearPlaceNgoofficer----------------", rank_data)
            if (!rank_data || req.body.rank !== 1 || rank_data.rank === 1) {
                // const get_data = await year_place_ngo_officer.findOne({ where: { place_id: req.body.place_id, year_id: req.body.year_id, ngo_id: req.body.ngo_id, officer_id: req.body.officer_id } });
                // if (!get_data) {

                if (req.body.place_id) {
                    await year_place_ngo_officer.update(req.body, { where: { id: condition_id } });
                    officers_heading_description.destroy({ where: { officer_id: req.body.officer_id, year_id: req.body.year_id } })
                    const headingsList = req.body.headingsList;
                    const headingsValueList = req.body.headingsValueList;
                    headingsList.length > 0 && headingsList.map(async (res, index) => {

                        // if(headingsValueList[index]?.headings_value){
                        const heading_value = headingsValueList.find(ress => ress.profile_id === res.id)

                        if (heading_value?.headings_value) {
                            let get_desc = generateHash(heading_value?.headings_value ?? "");
                            const description = {
                                // ypno_id: condition_id,                        
                                officer_id: req.body.officer_id,
                                year_id: req.body.year_id,
                                heading_id: res.id,
                                desc: get_desc,
                            }
                            // console.log(description);
                            await officers_heading_description.create(description);
                        }

                    })
                    return apiResponse.successResponse(res, "Data successfully updated.")
                } else {
                    return apiResponse.ErrorResponse(res, 'description missing')
                }
                // } else {
                //     return apiResponse.ErrorResponse(res, "Same Year Same Place Same NGO Same Officer Failed")
                // }
            } else {
                return apiResponse.ErrorResponse(res, "Same Year Same Place Same Rank Failed")
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
            query = `places.id`
        } else if (condition_name === 'division') {
            query = `places.division_id`
        } else if (condition_name === 'district') {
            query = `places.district_id`
        }
        const [results, metadata] = await sequelize.query(`select places.name,officers.name as officer_name,places.id as place_id,officers.image from places LEFT JOIN year_place_ngo_officers ypno on ypno.place_id = places.id LEFT JOIN officers on officers.id = ypno.officer_id where ${query} = ${id} GROUP BY places.id`)
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
        // query = `where year = (SELECT max(year) FROM ngo_place_info npi) and` + query
        query = `where year = year(curdate()) and` + query

        const [results, metadata] = await sequelize.query(`SELECT * FROM ngo_place_info2 ` + query + ` GROUP BY officer_name ORDER  BY ypno_view_order,officer_id`);

        if (results) {
            let final_arr = [];
            for (let i = 0; i < results.length; i++) {
                console.log('results[i].sarbik_desc', results[i].sarbik_desc);
                if (results[i].sarbik_desc !== null) {
                    let decrypted_data = decryptHash(results[i].sarbik_desc);
                    results[i].sarbik_desc = decrypted_data;
                    final_arr.push(results[i])
                } else {
                    results[i].sarbik_desc = '';
                    final_arr.push(results[i])
                }
            }
            console.log("resultsresultsresultsresultsresults", results)
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", final_arr)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

        // if (results) {
        //     return apiResponse.successResponseWithData(res, "Data successfully fetched.", results)
        // } else {
        //     return apiResponse.ErrorResponse(res, "No matching query found")
        // }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}