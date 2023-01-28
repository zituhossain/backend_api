const {Op} = require('sequelize');
const {Ngo,Officer,ngo_categories,Place, ngo_category_b } = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")

exports.create_ngo = async(req,res) => {
    try{
        const filePath = `uploads/logo/${req.file.filename}`;
        req.body.logo = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;

        if(req.body){
            await Ngo.create(req.body);
            return apiResponse.successResponse(res,"data successfully saved.")
        }else{
            return apiResponse.ErrorResponse(res,"Value missing.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.fetchall_by_place_id = async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const ngo_data = await Ngo.findAll({where: {place_id : ngo_id}});
        if(ngo_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.fetchall_ngo = async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const ngo_data = await Ngo.findAll({include:[Place]});
        if(ngo_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetchOtherNgo =async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const ngo_data = await Ngo.findAll({where:{type:"other"}, raw:true});
        if(ngo_data.length > 0){
            let ngo_datas =[]
            ngo_data.forEach((element,key) => {
                ngo_datas[key] = {Ngo:element}
            });
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_datas)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetchNgoCategoris =async(req,res) => {
    try{
        const ngo_data = await ngo_categories.findAll({attributes: {exclude: ['createdAt', 'updatedAt']},});
        if(ngo_data.length > 0){
            
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetchall_ngo_by_place =async(req,res) => {
    const place_id = req.params.id;
    try{
        const ngo_data = await Officer.findAll({
            // attributes:['Ngo'],
            where:{place_id,
                ngo_id: {
                    [Op.ne]: null
                }
            },
            include: [{
                model: Ngo
              }],
            group:['ngo_id']
        });
        if(ngo_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetchNgoCategorisByPlace =async(req,res) => {
    const place_id = req.params.id;
    try{
        const ngo_data = await ngo_category_b.findAll({
            where:{place_id},
            include: [{
                model: ngo_categories,
                as:"category",
                attributes: {exclude: ['createdAt', 'updatedAt']}
              }],
        });
        if(ngo_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",ngo_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.update_ngo = async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const filePath = `uploads/logo/${req.file.filename}`;
        req.body.logo = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.updated_by = userId;
        const ngo_data = await Ngo.findAll({where: {id : ngo_id}});
        if(ngo_data.length > 0){
            if(req.body){
                await Ngo.update(req.body,{where:{id:ngo_id}});
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

exports.delete_by_id = async(req,res) => {
    const ngo_id = req.params.id;
    try{
        const ngo_data = await Ngo.findAll({where: {id : ngo_id}});
        if(ngo_data.length > 0){
            await Ngo.destroy({where:{id:ngo_id}})
            return apiResponse.successResponse(res,"Data deleted successfully.")

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}