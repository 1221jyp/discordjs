const mongo = require("mongoose");

const CoinInfoSchema = new mongo.Schema(
  {
    coinName: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const userRegistration = new mongo.Schema({
  Guild: String,
  name: String,
  Money: Number,
  coins: [CoinInfoSchema],
});

module.exports = mongo.model("userlist", userRegistration);
