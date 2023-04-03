const mongoose = require("mongoose");

const updatedDataSchema = new mongoose.Schema({
  user_id: String,
  officer_id: String,
  year_id: String,
  datetime: Date,
  ip: String,
  localMachineIP: String,
  oldValues: {
    year_place_ngo_officer: Object,
    officers_heading_description: [String],
  },
  newValues: {
    year_place_ngo_officer: Object,
    officers_heading_description: [String],
  },
  tableName: {
    table1: String,
    table2: String,
  },
});

const UpdatedData = mongoose.model('UpdatedData', updatedDataSchema);


module.exports = UpdatedData;