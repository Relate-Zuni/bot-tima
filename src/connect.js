const mongo = require("../cnfg/mongo.json");
const mongoose = require("mongoose");

mongoose
  .connect(mongo.tokenMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("База данных подключена!"))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

let db = mongoose.connection;

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
  energy: Number
});

module.exports = usersModel = mongoose.model("users", users);

db.on("error", console.error.bind(console, "MongoDB connection error:"));
