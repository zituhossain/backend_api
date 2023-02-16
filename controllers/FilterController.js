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

exports.finalReportGenerate = async(req,res) => {
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
    const [alldata, metadata] = await sequelize.query(`SELECT * FROM Ngo_place_info` + query);
    if(alldata.length > 0){
        return apiResponse.successResponseWithData(res,"all_data fetch successfully.",alldata)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}
