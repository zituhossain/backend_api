const joi = require('joi');
const db = require('../models');
exports.ngoServedPercentByPlace = joi.object({ 
    place_id:joi.number().required(),
    division_id:joi.number().required(),
    district_id:joi.number().required(),
    ngo_id:joi.number().required(),
    percent:joi.number().required(),
});