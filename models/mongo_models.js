const mongoose = require("mongoose");

const UserLogSchema = new mongoose.Schema({
  api_route: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: false,
  },
  ip: {
    type: String,
    required: false,
  },
  user_id: {
    type: Number,
    default: 0,
  },
});

const Mongo_User_log = mongoose.model("User_log", UserLogSchema);

module.exports = Mongo_User_log;