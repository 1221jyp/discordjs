const mongo = require("mongoose");

const userRegistration = new mongo.Schema({
  Guild: String,
  name: String,
});

module.exports = mongo.model("userlist", userRegistration);
