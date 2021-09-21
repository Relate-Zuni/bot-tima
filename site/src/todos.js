const { Router } = require("express");
const { VK } = require("vk-io");
const { HearManager } = require("@vk-io/hear");


const updates = new HearManager();
const vk = new VK({ token: "72bc35a0104bcfe04738faf3a0195b1585b9ec5e2707dfc18015aa46de6ca1296aaa4eced9cc4de34672d" });

vk.updates.on("message_new", updates.middleware);

vk.updates.on("message_new", async (context, next) => {
return next();
});

const randomize = require("randomatic");

const confg = require("../qiwi.json");
const qiwi = require("./qiwi.js");

const router = Router();

const errorSend = "";

const mongoose = require("mongoose");

let donate = mongoose.model("donate");
let users = mongoose.model("users");

router.get("/", (req, res) => {
  res.render("index", {
    error: errorSend,
  });
});

router.post("/donate", async (req, res) => {
  let id = req.body.id;
  let amount = req.body.amount;
  if (!id) {
    res.redirect("/");
    return (errorSend = "Введите ID!");
  }
  if (!amount) {
    res.redirect("/");
    return (errorSend = "Введите количество донатной валюты!");
  }

  res.redirect(newDonate(Number(id), Number(amount)));
});


function newDonate(senderId, number) {
  const publicKey = confg.publickToken;

  let token = generateSecretToken();

  newD(token, number, senderId)

  const params = {
    publicKey,
    billId: token,
    amount: number,
    comment: senderId,
    successUrl: "bot-tima.herokuapp.com/",
  };

  return qiwi.createPaymentForm(params);
}

function newD(t,n,s) {
  donate4 = new donate({
    pide: "false",
    bullid: t,
    amount: n,
    senderId: s
      });
    
      donate4.save(function (err) {
        if (err) return console.log(err);
      });
}

function generateSecretToken() {
  let generateRandom = randomize("A0", 10);
  randomSecretKey =
    generateRandom.slice(0, 3) +
    "-" +
    generateRandom.slice(3, 6) +
    "-" +
    generateRandom.slice(6, 10);

  return randomSecretKey;
}

module.exports = router;

setInterval(async () => {
  let row = await donate.find({});

  if(!row.length) return;

  for (var i = 0; i < row.length; i++) {
    if (row[i].pide === "false") {
      const rowOne = await donate.findOne({ bullid:row[i].bullid });
      const user = await users.findOne({ id:rowOne.senderId });
  qiwi
    .getBillInfo(rowOne.bullid)
    .then((data) => {
      if (data.status.value === "WAITING") {
        console.log("Не оплачено");
      }
      if (data.status.value === "PAID") {
        console.log("Оплачено");
        rowOne.pide = "true";
        rowOne.save();
        user.balance += Number(rowOne.amount)
        user.save();
        vk.api.messages.send({
          user_id: rowOne.senderId,
          random_id: 0,
          message: `🔥 Поступил платёж в размере ${rowOne.amount} RUB, чтобы проверить баланс отправьте > баланс`
        })
       
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
}, 10000);

return vk.updates.start(() => {
  console.log("[BOT] Состояние: trure")
});