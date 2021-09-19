const mongo = require("../cnfg/mongo.json");
const mongoose = require("mongoose");

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const todoRoutes = require('../routes/todos')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(todoRoutes)

async function start() {
  try {
mongoose
  .connect(mongo.tokenMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => {
    console.log("Server started...");
  })
} catch (e) {
console.log(e);
}
}

start();

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