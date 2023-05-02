const apiResponse = require('../helpers/apiResponse');
const { User, User_role, Login_attempt, blacklist_ip } = require('../models');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generatePassword(value) {
    let salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(value, salt);
    // const saltRounds = 10;
    // return bcrypt.hashSync(value, saltRounds);
}

function comparePassword(value, hashStoredInDB) {
    const result = bcrypt.compare(value, hashStoredInDB);
    return result;
}

// function comparePassword(input, hash) {
//     return bcrypt.compareSync(input, hash);
// }


exports.deactivateuser = async (req, res) => {
    const userid = req.params.id;
    const user = await User.findOne({ where: { id: userid } });
    if (user) {
        await User.update({ status: "deleted" }, { where: { id: userid } });
        return apiResponse.successResponse(res, "user deactivate successfull.")
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.activateuser = async (req, res) => {
    const userid = req.params.id;
    const user = await User.findOne({ where: { id: userid } });
    if (user) {
        await User.update({ status: "active" }, { where: { id: userid } });
        try {
            await Login_attempt.destroy({ where: { user_id: userid } });
        } catch (err) {
            console.log(err.message)
        }
        try {
            await blacklist_ip.destroy({ where: { user_id: userid } })
        } catch (err) {
            console.log(err.message)
        }
        return apiResponse.successResponse(res, "user activation successfull.")
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

// exports.fetchalluser = async(req,res) => {
//     const user = await User.findAll({
//         include:[User_role]
//     });
//     if(user){
//         return apiResponse.successResponseWithData(res,"user fetch successfully.",user)
//     }else{
//         return apiResponse.ErrorResponse(res,"No data found")
//     }
// }

exports.fetchalluser = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [User_role],
            attributes: { exclude: ['createdAt', 'updatedAt'] }, // exclude timestamps
        });
        if (users) {
            const decryptedUsers = await Promise.all(users.map(async user => {
                const { password1, password2 } = user;
                const hashedPassword1FromDatabase = await generatePassword(password1);
                const hashedPassword2FromDatabase = await generatePassword(password2);
                const decryptedPassword1 = password1 ? await comparePassword(password1, hashedPassword1FromDatabase) : undefined; // compare hashed password1 if defined
                const decryptedPassword2 = password2 ? await comparePassword(password2, hashedPassword2FromDatabase) : undefined; // compare hashed password2 if defined
                return { ...user.toJSON(), password1: decryptedPassword1, password2: decryptedPassword2 };
            }));
            return apiResponse.successResponseWithData(res, "users fetched successfully.", decryptedUsers)
        } else {
            return apiResponse.ErrorResponse(res, "No data found")
        }
    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error fetching users");
    }
}







exports.getuserloginattempt = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken._id;

        const fetch_user_login_attempt = await Login_attempt.findAll({ where: { user_id: userId } })
        if (fetch_user_login_attempt.length > 0) {
            return apiResponse.successResponseWithData(res, "user data fetch successfully.", fetch_user_login_attempt)
        } else {
            return apiResponse.ErrorResponse(res, "No data found.")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

