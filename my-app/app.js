const express = require("express");
const app = express();

const routes = require("./routes/routes");

app.set("view engine", "hbs");
app.set('views', __dirname + '/views');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, function () {
  try {
    console.log("Express started in port: 3000");
  } catch (e) {
    console.log(e);
  }
});
