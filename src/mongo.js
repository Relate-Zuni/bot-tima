const mongo = require("../cnfg/mongo.json");
const mongoose = require("mongoose");

(function () {
  try {
    mongoose.connect(mongo.tokenMongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return console.log("MongoDB connect...");
  } catch (e) {
    if(e) return console.log(e);
  }
})();

let Schema = mongoose.Schema;

let users = new Schema({
  uid: Number,
  id: Number,
  name: String,
  balance: Number,
  experience: Number,
  admin: Number,
  work: Number,
  airline: Number,
  nameAirline: String,
  balanceAirline: Number,
  energy: Number,
});

module.exports = usersModel = mongoose.model("users", users);
