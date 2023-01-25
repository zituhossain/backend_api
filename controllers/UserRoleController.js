const apiResponse = require('../helpers/apiResponse');
const {User_role,Previlege_area,User,Previlege_url,Previlege_table} = require('../models');
const db = require('../db/db');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

exports.createuserrole = async(req,res) => {
    try{
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'name,permission,previlege_id missing')
        }else{
            await User_role.create(req.body);
            return apiResponse.successResponse(res,'role saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.assignuserrole = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.role_id && req.body.user_id){
                await User.update({role_id:req.body.role_id},{where:{id: req.body.user_id}})
                return apiResponse.successResponse(res,"role successfully assigned.")
            }else{
                return apiResponse.ErrorResponse(res,"role_id/user_id missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to assign user role.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.removeuserrole = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.user_id){
                await User.update({role_id:null},{where:{id: req.body.user_id}})
                return apiResponse.successResponse(res,"role successfully removed.")
            }else{
                return apiResponse.ErrorResponse(res,"user_id missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to remove user role.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getallrole = async(req,res) => {
    try{
        const role_data = await User_role.findAll({
            include: [Previlege_area]
          });
        if(role_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",role_data)
        }else{
            return apiResponse.ErrorResponse(res,"Role table is empty.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getallprevilegearea = async(req,res) => {
    try{
        const previlegearea_data = await Previlege_area.findAll();
        if(previlegearea_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",previlegearea_data)
        }else{
            return apiResponse.ErrorResponse(res,"Previlege area is empty.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.getallprevilegeurl = async(req,res) => {
    try{
        const previlegearea_data = await Previlege_url.findAll({
            include:[Previlege_area]
        });
        if(previlegearea_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",previlegearea_data)
        }else{
            return apiResponse.ErrorResponse(res,"Previlege url is empty.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.createprevilegearea = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.name){
                await Previlege_area.create(req.body)
                return apiResponse.successResponse(res,"previlege area successfully created.")
            }else{
                return apiResponse.ErrorResponse(res,"name missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to create previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.updateprevilegearea = async(req,res) => {
    try{
        const id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.name){
                const if_exist = await Previlege_area.findOne({where:{id: id}})
                if(if_exist){
                    await Previlege_area.update(req.body,{where: {id:id}})
                    return apiResponse.successResponse(res,"previlege area successfully updated.")
                }else{
                    return apiResponse.ErrorResponse(res,"No data found")
                }
                
            }else{
                return apiResponse.ErrorResponse(res,"name missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to create previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.updateprevilegeurl = async(req,res) => {
    try{
        const id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.name && req.body.url && req.body.previlege_area_id){
                const if_exist = await Previlege_url.findOne({where:{id: id}})
                if(if_exist){
                    await Previlege_url.update(req.body,{where: {id:id}})
                    return apiResponse.successResponse(res,"previlege url successfully updated.")
                }else{
                    return apiResponse.ErrorResponse(res,"No data found")
                }
                
            }else{
                return apiResponse.ErrorResponse(res,"name/url/previlege_area_id missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to create previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.deleteprevilegearea = async(req,res) => {
    try{
        const id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            const if_exist = await Previlege_area.findOne({where:{id: id}})
            if(if_exist){
                await Previlege_area.destroy({where: {id:id}})
                return apiResponse.successResponse(res,"previlege area successfully deleted.")
            }else{
                return apiResponse.ErrorResponse(res,"No data found")
            }
                
            
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to delete previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.deleteprevilegeurl = async(req,res) => {
    try{
        const id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            const if_exist = await Previlege_url.findOne({where:{id: id}})
            if(if_exist){
                await Previlege_url.destroy({where: {id:id}})
                return apiResponse.successResponse(res,"previlege url successfully deleted.")
            }else{
                return apiResponse.ErrorResponse(res,"No data found")
            }
                
            
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to delete previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.getrolebyid = async(req,res) => {
    try{
        const role_id = req.params.id;
        const role_data = await User_role.findOne({where:{id: role_id}});
        if(role_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",role_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.deleterolebyid = async(req,res) => {
    try{
        const role_id = req.params.id;
        const role_data = await User_role.findOne({where:{id: role_id}});
        if(role_data){
            await User_role.destroy({where:{id: role_id}})
            return apiResponse.successResponse(res,"Data successfully deleted.")
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.createprevilegeurl = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.name && req.body.url && req.body.previlege_area_id){
                await Previlege_url.create(req.body)
                return apiResponse.successResponse(res,"previlege area successfully created.")
            }else{
                return apiResponse.ErrorResponse(res,"name/previlege_area_id/url missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to create previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.createprevilegetable = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.user_role_id && req.body.previlege_url_id){
                if(req.body.previlege_url_id.length > 0){
                    for(i=0;i<req.body.previlege_url_id.length;i++){
                        await Previlege_table.create({user_role_id : req.body.user_role_id,previlege_url_id : req.body.previlege_url_id[i],permission:true})
                    }
                }
                return apiResponse.successResponse(res,"previlege successfully created.")
            }else{
                return apiResponse.ErrorResponse(res,"user_role_id/previlege_url_id missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to create previlege area.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.deleteprevilegetable = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        const user_data = await User.findOne({where:{id: userId}})
        if(user_data.role_id && user_data.role_id === 1){
            if(req.body.user_role_id && req.body.previlege_url_id){
                await Previlege_table.destroy({where:{user_role_id:req.body.user_role_id,previlege_url_id:req.body.previlege_url_id}})
                return apiResponse.successResponse(res,"previlege successfully deleted.")
            }else{
                return apiResponse.ErrorResponse(res,"user_role_id/previlege_url_id missing")
            }
        }else{
            return apiResponse.unauthorizedResponse(res,"You have no permission to delete previlege.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getprevilegetable = async(req,res) => {
    try{
        const role_id = req.params.id;
        const user_data = await Previlege_table.findAll({
            include:[User_role],
            where:{user_role_id: role_id}
        })
        if(user_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data found",user_data)
        }else{
            return apiResponse.unauthorizedResponse(res,"No data found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}