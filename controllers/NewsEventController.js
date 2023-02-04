const {News_event,Division,District,Place} = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")
const checkUserRoleByPlace = require('./globalController');
const { Op } = require("sequelize");

exports.create_news_event = async(req,res) => {
    try{
        const filePath = `uploads/news_event/${req.file.filename}`;
        req.body.image = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;

        if(req.body.place_id === 'null' || req.body.place_id === ''){
            req.body.place_id = null;
        }
        if(req.body.district_id === 'null' || req.body.district_id === ''){
            req.body.district_id = null;
        }
        if(req.body.division_id === 'null' || req.body.division_id === ''){
            req.body.division_id = null;
        }


        if(req.body){
            await News_event.create(req.body);
            return apiResponse.successResponse(res,"data successfully saved.")
        }else{
            return apiResponse.ErrorResponse(res,"Value missing.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.update_news_event = async(req,res) => {
    const news_event_id = req.params.id;
    try{
        const filePath = `uploads/news_event/${req.file.filename}`;
        req.body.image = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.updated_by = userId;
        const news_event_data = await News_event.findAll({where: {id : news_event_id}});
        if(news_event_data.length > 0){
            if(req.body.place_id === ''){
                req.body.place_id = null;
            }
            if(req.body.district_id === ''){
                req.body.district_id = null;
            }
            if(req.body.division_id === ''){
                req.body.division_id = null;
            }
            if(req.body){
                await News_event.update(req.body,{where:{id:news_event_id}});
                return apiResponse.successResponse(res,"data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,"Value missing.")
            }
        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.fetch_news_event_by_id = async(req,res) => {
    try{
        const id = req.params.id;
        const value_name = req.params.value;
        let arr = []
        let place_id = [];
        if(value_name=='place'){
            arr.push({place_id: id})
            // const get_place_by_place = await Place.findAll({
            //     where:{
            //         place_id: id
            //     }
            // })
    
            // for(i=0;i<get_place_by_place.length;i++){
            //     place_id.push(get_place_by_place[i].id)
            // }
        }else if(value_name=='district'){
            arr.push({district_id: id})
            // const get_place_by_district = await Place.findAll({
            //     where:{
            //         district_id: id
            //     }
            // })
    
            // for(i=0;i<get_place_by_district.length;i++){
            //     place_id.push(get_place_by_district[i].id)
            // }
        }else if(value_name=='division'){
            arr.push({division_id: id})
            // const get_place_by_division = await Place.findAll({
            //     where:{
            //         division_id: id
            //     }
            // })
    
            // for(i=0;i<get_place_by_division.length;i++){
            //     place_id.push(get_place_by_division[i].id)
            // }
        }
        
        
        
        const news_event_data = await News_event.findAll({
            // where: {place_id: place_id}
            where: arr
        });
        if(news_event_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",news_event_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetch_single_news_event_by_id = async(req,res) => {
    try{
        const id = req.params.id;
        const news_event_data = await News_event.findOne({
            where: {id: id},
            include:[Place,Division,District]
        });
        if(news_event_data){
            const news_other_data = await News_event.findAll({
                where: {id: { [Op.ne]: id}}
            });
            const data = {
                selected_data: news_event_data,
                other_data : news_other_data
            }
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetch_all_news = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        let roleByplace = await checkUserRoleByPlace(token)
        // console.log(roleByplace)
        let arr = []
        if(roleByplace.district.length > 0){
            arr.push({district_id: roleByplace.district})
        }else if(roleByplace.division.length > 0){
            arr.push({division_id: roleByplace.division})
        }else if(roleByplace.place.length > 0){
            arr.push({id: roleByplace.place})
        }
        const news_event_data = await News_event.findAll({
            include:[Division,District,Place],
            where: arr
        });
        if(news_event_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",news_event_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.delete_by_id = async(req,res) => {
    const news_event_id = req.params.id;
    try{
        const news_event_data = await News_event.findAll({where: {id : news_event_id}});
        if(news_event_data.length > 0){
            await News_event.destroy({where:{id:news_event_id}})
            return apiResponse.successResponse(res,"Data deleted successfully.")

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
