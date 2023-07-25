const mongoose = require("mongoose");

const reportMasterSchema = new mongoose.Schema({
  user_id: String,
  datetime: Date,
  ip: String,
  alldata: [Object]
});

const reportMaster = mongoose.model('reportMaster', reportMasterSchema);


module.exports = reportMaster;
