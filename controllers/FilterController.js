const apiResponse = require('../helpers/apiResponse');
const {Division, District, Place,year_place_ngo_officer,Ngo,years,sequelize} = require('../models');
const CryptoJS = require('crypto-js');


exports.divisions = async(req,res) => {
    const divisionsAll = await Division.findAll();
    if(divisionsAll){
        return apiResponse.successResponseWithData(res,"all_title fetch successfully.",divisionsAll)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
exports.districtById = async(req,res) => {
    const division_id = req.params.id;
    const districtsById = await District.findAll({where:{division_id}});
    if(districtsById){
        return apiResponse.successResponseWithData(res,"all_title fetch successfully.",districtsById)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
exports.placesByDistricId = async(req,res) => {
    const district_id = req.params.id;
    const placeAll = await Place.findAll({where:{district_id}});
    if(placeAll){
        return apiResponse.successResponseWithData(res,"all_title fetch successfully.",placeAll)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
exports.places = async(req,res) => {
    const district_id = req.params.id;
    const placeAll = await Place.findAll();
    if(placeAll.length>0){
        return apiResponse.successResponseWithData(res,"all_place fetch successfully.",placeAll)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
exports.finalReportGenerate = async(req,res) => {
    let query = ''
    if(req.body.year_id !== ''){
        const get_year = await years.findOne({where:{id:req.body.year_id}})
        if(query.includes('where')){
            query += ` and year = '${get_year.name}'`
        }else{
            query += ` where year = '${get_year.name}'`
        }
        
    }

    if(req.body.division_id !== ''){
        const get_division = await Division.findOne({where:{id:req.body.division_id}})
        if(query.includes('where')){
            query += ` and division_name = '${get_division.name_bg}'`
        }else{
            query += ` where division_name = '${get_division.name_bg}'`
        }
        
    }
    if(req.body.district_id !==''){
        const get_district = await District.findOne({where:{id:req.body.district_id}})
        if(query.includes('where')){
            query += ` and district_name = '${get_district.name_bg}'`
        }else{
            query += ` where district_name = '${get_district.name_bg}'`
        }
        
    }
    if(req.body.place_id !== ''){
        const get_place = await Place.findOne({where:{id:req.body.place_id}})
        if(query.includes('where')){
            query += ` and place_name = '${get_place.name}'`
        }else{
            query += ` where place_name = '${get_place.name}'`
        }
        
    }
    let custome_query = '';
    if(req.body.ngo_id === ''){ 
        custome_query = `,(select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = Ngo_place_info.place_id and year_place_ngo_officers.ngo_id = 1) as ngo_officer_one`
    }else{
        custome_query = `,(select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = Ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id}) as ngo_officer_one`
    } 
    if(req.body.ngo_id !== ''){        
        const get_ngo = await Ngo.findOne({where:{id:req.body.ngo_id}})
        if(query.includes('where')){
            // query += ` and ngo_name = '${get_ngo.name}'`
        }else{
            query += ` where ngo_name = '${get_ngo.name}'`
        }
        if(req.body.ngo_id2 !== ''){
            const get_ngo2 = await Ngo.findOne({where:{id:req.body.ngo_id2}})
            query += ` or ngo_name = '${get_ngo2.name}'`
        }        
    }
    if(req.body.category !== '' && req.body.category!== null){
        
        if(query.includes('where')){
            query += ` and categoryb_id = '${req.body.category}'`
        }else{
            query += ` where categoryb_id = '${req.body.category}'`
        }       
    }
    // const [alldata, metadata] = await sequelize.query(`SELECT * FROM Ngo_place_info` + query + ` GROUP BY officer_name`);
    console.log('custome_query',custome_query);
    console.log('query',query);
    const [alldata, metadata] = await sequelize.query(`SELECT Ngo_place_info.*,(select ngo_name from Ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name =(select years.name from years order by id DESC LIMIT 1,1) and year_place_ngo_officers.place_id = Ngo_place_info.place_id limit 1) as ngo_officer ${custome_query} FROM Ngo_place_info` + query + ` GROUP BY place_id`);
    if(alldata.length > 0){
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",alldata)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
exports.finalReportGenerateDoubleNGO = async(req,res) => {
    let query = ''
    if(req.body.year_id != ''){
        const get_year = await years.findOne({where:{id:req.body.year_id}})
        if(query.includes('where')){
            query += ` and year = '${get_year.name}'`
        }else{
            query += ` where year = '${get_year.name}'`
        }
        
    }

    if(req.body.division_id != ''){
        const get_division = await Division.findOne({where:{id:req.body.division_id}})
        if(query.includes('where')){
            query += ` and division_name = '${get_division.name_bg}'`
        }else{
            query += ` where division_name = '${get_division.name_bg}'`
        }
        
    }
    if(req.body.district_id != ''){
        const get_district = await District.findOne({where:{id:req.body.district_id}})
        if(query.includes('where')){
            query += ` and district_name = '${get_district.name_bg}'`
        }else{
            query += ` where district_name = '${get_district.name_bg}'`
        }
        
    }
    if(req.body.place_id != ''){
        const get_place = await Place.findOne({where:{id:req.body.place_id}})
        if(query.includes('where')){
            query += ` and place_name = '${get_place.name}'`
        }else{
            query += ` where place_name = '${get_place.name}'`
        }
        
    }
    const [alldata, metadata] = await sequelize.query(`SELECT Ngo_place_info.*,(select ngo_name from Ngo_place_info npi where ngo_id = 1 limit 1) as ngo_name2,(select ngo_name from Ngo_place_info npi where ngo_id = 2 limit 1) as ngo_name3,(select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = Ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id}) as ngo_officer_one, (select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name = (select Max(name) from years) and year_place_ngo_officers.place_id = Ngo_place_info.place_id and year_place_ngo_officers.ngo_id = ${req.body.ngo_id2}) as ngo_officer_two,(select Officers.name from year_place_ngo_officers LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id LEFT JOIN years on years.id = year_place_ngo_officers.year_id where years.name =(select years.name from years order by id DESC LIMIT 1,1) and year_place_ngo_officers.place_id = Ngo_place_info.place_id limit 1) as ngo_officer FROM Ngo_place_info` + query + ` GROUP BY place_id`);
    if(alldata.length > 0){
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",alldata)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

var decryptHash = (value) => {
	// return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
	const passphrase = '123';
	const bytes = CryptoJS.AES.decrypt(value, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
}


exports.finalReportGenerateOfficerProfileNGO_new = async(req,res) => {
    let query = ' where years.name = year(curdate())'

    if(req.body.division_id != ''){
        if(query.includes('where')){
            query += ` and Places.division_id = ${req.body.division_id}`
        }else{
            query += ` where Places.division_id = ${req.body.division_id}`
        }
        
    }
    if(req.body.district_id != ''){
        if(query.includes('where')){
            query += ` and Places.district_id = '${req.body.district_id}'`
        }else{
            query += ` where Places.district_id = '${req.body.district_id}'`
        }
        
    }
    if(req.body.place_id != ''){
        if(query.includes('where')){
            query += ` and Places.id = '${req.body.place_id}'`
        }else{
            query += ` where Places.id = '${req.body.place_id}'`
        }
        
    }
    if(req.body.heading_id != ''){
        if(query.includes('where')){
            query += ` and heading_id = '${req.body.heading_id}'`
        }else{
            query += ` where heading_id = '${req.body.heading_id}'`
        }
        
    }

    if(req.body.type_id != ''){
        if(query.includes('where')){
            query += ` and officer_profile_headings.type = '${req.body.type_id}'`
        }else{
            query += ` where officer_profile_headings.type = '${req.body.type_id}'`
        }
        
    }

    if(req.body.ngo_id !== ''){        
        if(query.includes('where')){
            query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
        }else{
            query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
        }       
    }
    const [alldata, metadata] = await sequelize.query(`SELECT *,GROUP_CONCAT ( DISTINCT heading) as multiple_heading,GROUP_CONCAT ( DISTINCT officers_heading_descriptions.desc) as multiple_desc,Places.id as place_id,Places.name as place_name,Officers.name as officer_name,Ngos.name as ngo_name,Ngos.id as ngo_id FROM year_place_ngo_officers LEFT JOIN officers_heading_descriptions ON year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.officer_id left join officer_profile_headings on officer_profile_headings.id = officers_heading_descriptions.heading_id left join years on years.id = year_place_ngo_officers.year_id left join Places on Places.id = year_place_ngo_officers.place_id left join Officers on Officers.id = year_place_ngo_officers.officer_id left join Ngos on Ngos.id = year_place_ngo_officers.ngo_id`+query);
    if(alldata.length > 0){
        let final_data = [];
        for(let i=0;i<alldata.length;i++){
            let current_desc = alldata[i].desc;
            let decoded_desc = "";
            if(current_desc){
                decoded_desc = decryptHash(current_desc);
            }else{
                decoded_desc = ""
            }
            alldata[i].desc = decoded_desc;
            final_data.push(alldata[i]);
        }
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",final_data)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.finalReportGenerateOfficerProfileNGO = async(req,res) => {
    let query = ' and years.name = year(curdate())'

    if(req.body.division_id != ''){
        if(query.includes('where')){
            query += ` and Places.division_id = ${req.body.division_id}`
        }else{
            query += ` where Places.division_id = ${req.body.division_id}`
        }
        
    }
    if(req.body.district_id != ''){
        if(query.includes('where')){
            query += ` and Places.district_id = '${req.body.district_id}'`
        }else{
            query += ` where Places.district_id = '${req.body.district_id}'`
        }
        
    }
    if(req.body.place_id != ''){
        if(query.includes('where')){
            query += ` and Places.id = '${req.body.place_id}'`
        }else{
            query += ` where Places.id = '${req.body.place_id}'`
        }
        
    }
    if(req.body.heading_id != ''){
        if(query.includes('where')){
            query += ` and heading_id = '${req.body.heading_id}'`
        }else{
            query += ` where heading_id = '${req.body.heading_id}'`
        }
        
    }

    if(req.body.type_id != ''){
        if(query.includes('where')){
            query += ` and officer_profile_headings.type = '${req.body.type_id}'`
        }else{
            query += ` where officer_profile_headings.type = '${req.body.type_id}'`
        }
        
    }

    if(req.body.ngo_id !== ''){        
        if(query.includes('where')){
            query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
        }else{
            query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
        }       
    }
    // const [alldata, metadata] = await sequelize.query(`SELECT *,Places.id as place_id,Places.name as place_name,Officers.name as officer_name,Ngos.name as ngo_name,Ngos.id as ngo_id FROM year_place_ngo_officers LEFT JOIN officers_heading_descriptions ON year_place_ngo_officers.officer_id = officers_heading_descriptions.officer_id and year_place_ngo_officers.year_id = officers_heading_descriptions.officer_id left join officer_profile_headings on officer_profile_headings.id = officers_heading_descriptions.heading_id left join years on years.id = year_place_ngo_officers.year_id left join Places on Places.id = year_place_ngo_officers.place_id left join Officers on Officers.id = year_place_ngo_officers.officer_id left join Ngos on Ngos.id = year_place_ngo_officers.ngo_id`+query);
    const [alldata, metadata] = await sequelize.query(`select (select GROUP_CONCAT(concat(id,'-',type)) from Profile_types ORDER by sort) as type_list,(select GROUP_CONCAT(concat(type,'-',id,'-',heading)) from officer_profile_headings ORDER by view_sort,type) heading_list,(select GROUP_CONCAT(CONCAT(heading_id,'-',type,'-',officers_heading_descriptions.desc)) from officers_heading_descriptions left join officer_profile_headings on officers_heading_descriptions.heading_id = officer_profile_headings.id where officer_id = year_place_ngo_officers.officer_id and year_id = year_place_ngo_officers.year_id order by heading_id) description_list, Places.id as place_id,Places.name as place_name,Ngos.name as ngo_name,Officers.name as officer_name,Officers.image as officer_photo,Places.area from Places LEFT join year_place_ngo_officers on year_place_ngo_officers.place_id = Places.id LEFT join Ngos on Ngos.id = year_place_ngo_officers.ngo_id LEFT JOIN Officers on Officers.id = year_place_ngo_officers.officer_id left JOIN years on years.id = year_place_ngo_officers.year_id where year_place_ngo_officers.status = 1 ${query} GROUP by year_place_ngo_officers.officer_id`);
    console.log(alldata);
    if(alldata.length > 0){
        let final_data = [];
        for(let i=0;i<alldata.length;i++){
            alldata[i].description_list = alldata[i].description_list!== null?alldata[i].description_list.split(',')?.map(res=> {
                const desc = res.split('-');
                const newDesc = decryptHash(desc[2]);
                return desc[0].concat("-", desc[1]).concat("-", newDesc);
            }):alldata[i].description_list;
            // let decoded_desc = "";
            // if(current_desc){
            //     decoded_desc = decryptHash(current_desc);
            // }else{
            //     decoded_desc = ""
            // }
            // alldata[i].desc = decoded_desc;
            final_data.push(alldata[i]);
        }
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",final_data)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.finalReportGenerateAdminOfficer = async(req,res) => {
    let query = ''

    if(req.body.division_id != ''){
        if(query.includes('where')){
            query += ` and Administration_officers.division_id = '${req.body.division_id}'`
        }else{
            query += ` where Administration_officers.division_id = '${req.body.division_id}'`
        }
        
    }
    if(req.body.district_id != ''){
        const get_district = await District.findOne({where:{id:req.body.district_id}})
        if(query.includes('where')){
            query += ` and Administration_officers.district_id = '${req.body.district_id}'`
        }else{
            query += ` where Administration_officers.district_id = '${req.body.district_id}'`
        }
        
    }
    if(req.body.place_id != ''){
        if(query.includes('where')){
            query += ` and Administration_officers.place_id = '${req.body.place_id}'`
        }else{
            query += ` where Administration_officers.place_id = '${req.body.place_id}'`
        }
        
    }
    const [alldata, metadata] = await sequelize.query(`select *,Administration_officers.name as officer_name,Administration_offices.name as office_name from Administration_officers left join Administration_offices on Administration_officers.administration_office_id = Administration_offices.id`+query);
    if(alldata.length > 0){
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",alldata)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.finalReportGenerateResult = async(req,res) => {
    let query = ''
    let default_year = '(select id from years order by id DESC LIMIT 1,1)'
    if(req.body.year_id != ''){
        const get_year = await years.findOne({where:{id:req.body.year_id}})
        default_year = get_year.id
        
    }

    if(req.body.division_id != ''){
        if(query.includes('where')){
            query += ` and division_id = '${req.body.division_id}'`
        }else{
            query += ` where division_id = '${req.body.division_id}'`
        }
        
    }
    if(req.body.district_id != ''){
        const get_district = await District.findOne({where:{id:req.body.district_id}})
        if(query.includes('where')){
            query += ` and district_id = '${req.body.district_id}'`
        }else{
            query += ` where district_id = '${req.body.district_id}'`
        }
        
    }
    if(req.body.place_id != ''){
        if(query.includes('where')){
            query += ` and Places.id = '${req.body.place_id}'`
        }else{
            query += ` where Places.id = '${req.body.place_id}'`
        }
        
    }
    // if(req.body.ngo_id !== ''){        
    //     if(query.includes('where')){
    //         query += ` and year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
    //     }else{
    //         query += ` where year_place_ngo_officers.ngo_id = '${req.body.ngo_id}'`
    //     }       
    // }
    const [alldata, metadata] = await sequelize.query(`SELECT
        Places.id AS place_id,
        Places.name AS place_name,
        Places.division_id  AS division_id,
        Places.district_id AS district_id,
        (
        SELECT
            Officers.name
        FROM
            year_place_ngo_officers
        LEFT JOIN Officers ON Officers.id = year_place_ngo_officers.officer_id
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo_officer1,
    (
        SELECT
            Ngos.name
        FROM
            year_place_ngo_officers
        LEFT JOIN Ngos ON Ngos.id = year_place_ngo_officers.ngo_id
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo1,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 1 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS served_population1,
    (
        SELECT
            Officers.name
        FROM
            year_place_ngo_officers
        LEFT JOIN Officers ON Officers.id = year_place_ngo_officers.officer_id
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo_officer2,
    (
        SELECT
            Ngos.name
        FROM
            year_place_ngo_officers
        LEFT JOIN Ngos ON Ngos.id = year_place_ngo_officers.ngo_id
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS ngo2,
    (
        SELECT
            year_place_ngo_officers.served_population
        FROM
            year_place_ngo_officers
        WHERE
            rank = 2 AND year_place_ngo_officers.place_id = Places.id AND year_place_ngo_officers.year_id = ${default_year} AND year_place_ngo_officers.status = 1
        GROUP BY
            year_place_ngo_officers.ngo_id
    ) AS served_population2
    FROM
        Places`+query);
    if(alldata.length > 0){
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",alldata)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}