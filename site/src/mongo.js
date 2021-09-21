const mongoose = require("mongoose");

(function () {
  try {
    mongoose.connect("mongodb+srv://timofei:jui2bQP2@cluster0.jjb63.mongodb.net/mongo?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return console.log("MongoDB connect...");
  } catch (e) {
    if(e) return console.log(e);
  }
})();

let Schema = mongoose.Schema;

let donate = new Schema({
  pide: String,
  bullid: String,
  amount: Number,
  senderId: Number
});

module.exports = usersModel = mongoose.model("donate", donate);
