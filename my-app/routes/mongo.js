const mongo = require("../tmp/config.json");
const mongoose = require("mongoose");

/*(function () {
  try {
    mongoose.connect(mongo.mongoTokenSecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return console.log("Mongo started in port: true");
  } catch (e) {
    if(e) return console.log(e);
  }
})();*/

let Schema = mongoose.Schema;

let users = new Schema({
  uid: Number,
  id: Number,
  name: String,
  balance: Number,
  donateBalance: 0,
  experience: Number,
  admin: Number,
  work: Number,
  airline: Number,
  nameAirline: String,
  balanceAirline: Number,
  energy: Number,
});

let mongoo = mongoose.model("users");

module.exports = mongoo;
