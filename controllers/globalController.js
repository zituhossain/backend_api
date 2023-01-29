const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const {Previlege_place_division_district} = require('../models');


const checkUserRoleByPlace = async(token) =>{
    const decodedToken = jwt.verify(token, secret);
    // console.log(decodedToken)
    let role_id = decodedToken.role;
    const fetch_role_data = await Previlege_place_division_district.findAll({where:{user_role_id:role_id}})
    // console.log(fetch_role_data);
    let place_arr = [];
    let division_arr = [];
    let district_arr = [];

    if(fetch_role_data.length>0){
        for(i=0;i<fetch_role_data.length;i++){
            if(fetch_role_data[i].place_id && !place_arr.includes(fetch_role_data[i].place_id)){
                place_arr.push(fetch_role_data[i].place_id)
            }
            if(fetch_role_data[i].division_id && !division_arr.includes(fetch_role_data[i].division_id)){
                division_arr.push(fetch_role_data[i].division_id)
            }
            if(fetch_role_data[i].district_id && !district_arr.includes(fetch_role_data[i].district_id)){
                district_arr.push(fetch_role_data[i].district_id)
            }
        }
    }
    
    // return {place: [8],division: [5],district: [36]}
    if(role_id === 1){
        return {place: [],division: [],district: []}
    }else{
        return {place: place_arr,division: division_arr,district: district_arr}
    }
}

module.exports = checkUserRoleByPlace;