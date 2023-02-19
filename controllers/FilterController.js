const apiResponse = require('../helpers/apiResponse');
const {Division, District, Place,year_place_ngo_officer,Ngo,years,sequelize} = require('../models');



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
    // const [alldata, metadata] = await sequelize.query(`SELECT * FROM Ngo_place_info` + query + ` GROUP BY officer_name`);
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
