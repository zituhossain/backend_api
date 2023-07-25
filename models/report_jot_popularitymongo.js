const mongoose = require("mongoose");

const reportJotPopularitySchema = new mongoose.Schema({
  user_id: String,
  datetime: Date,
  ip: String,
  alldata: [Object]
});

const reportJotPopularity = mongoose.model('reportJotPopularity', reportJotPopularitySchema);


module.exports = reportJotPopularity;


