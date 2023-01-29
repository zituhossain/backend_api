const apiResponse = require('../helpers/apiResponse');
const {local_influencer , Place} = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const checkUserRoleByPlace = require('./globalController');

exports.fetchalllocalinfluencer = async(req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    let roleByplace = await checkUserRoleByPlace(token)
    // console.log(roleByplace)
    let arr = []
    if(roleByplace.place.length > 0){
        arr.push({place_id: roleByplace.place})
    }
    const allLocalInfluencer = await local_influencer.findAll({
        include: [Place],
        where: arr
    });
    if(allLocalInfluencer){
        return apiResponse.successResponseWithData(res,"local_influencer fetch successfully.",allLocalInfluencer)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getlocalinfluencerbyid = async(req,res) => {
    try{
        const influencer_id = req.params.id;
        const influencer_data = await local_influencer.findOne({include: [Place] ,where:{id: influencer_id}});
        if(influencer_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",influencer_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getlocalinfluencerbyplaceid = async(req,res) => {
    try{
        const influencer_id = req.params.placeid;
        const influencer_data = await local_influencer.findAll({include: [Place] ,where:{place_id: influencer_id}});
        if(influencer_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",influencer_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.createlocalinfluencer = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.createdby = userId;
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'place/name/type/designation/organization missing')
        }else{
            await local_influencer.create(req.body);
            return apiResponse.successResponse(res,'local influencer saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updatelocalinfluencerbyid = async(req,res) => {
    try{
        const influencer_id = req.params.id;
        const influencer_data = await local_influencer.findOne({where:{id: influencer_id}});
        if(influencer_data){
            if(req.body.place_id && req.body.name && req.body.designation){
                await local_influencer.update(req.body, { where: { id: influencer_id } });
                return apiResponse.successResponse(res,"Data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,'place/condition missing')
            }
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}