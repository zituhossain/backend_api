const joi = require('joi');
const db = require('../models');
exports.ngoJotCreate = joi.object({ 
    name:joi.string().required(),
    color_code:joi.string().required()
    
});