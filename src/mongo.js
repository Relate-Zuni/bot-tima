const mongo = require("../cnfg/config.json");
const mongoose = require("mongoose");

(function () {
  mongoose
    .connect(mongo.tokenMongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      return console.log("Mongo started!");
    })
    .catch((error) => {
      if (error) return console.log(error);
    });
})();

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

mongoose.model("users", users);
