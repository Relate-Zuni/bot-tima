const express = require("express");
const fs = require('fs');

const router = express.Router();

const vk = require("./vkontakte");
const newMongo = require("./mongo");
const tmp = require("../tmp/config.json");
const donates = require("../../database/donates.json");
const qiwi = require("./qiwi");

router.get("/", function (request, response) {
  response.render("index", {
    title: "Задонатить",
  });
});

router.post("/", function (request, response) {
  if (!request.body.id || !request.body.selid) return response.redirect("/");

  const publicKey = tmp.qiwiTokenPublick;
  const goods = [
    { id: "1-2", name: "ULTRA статус", price: 1790, uid: 3000 },
    { id: "1-3", name: "АДМИНИСТРАТОР", price: 1500, uid: 4005 },
    { id: "1-4", name: "VIP статус", price: 299, uid: 4003 },
    { id: "2-1", name: "1.000.000.000.000$", price: 199, uid: 5004 },
    { id: "3-1", name: "Снять вечный бан", price: 500, uid: 3300 },
  ];
  //goods[Number(request.body.selid) - 1].price
  const params = {
    publicKey,
    amount: 1,
    billId: donates.length + 1,
    successUrl: "vk.com/id1",
  };
  const don = {
    amount: goods[Number(request.body.selid) - 1].price,
    billId: donates.length + 1,
    comment: request.body.id,
    idGoods: goods[Number(request.body.selid) - 1].uid,
    pide: false,
  };

  if (request.body.id || request.body.selid)
    response.redirect(qiwi.createPaymentForm(params));
  donates.push({don});
  return saveDonates();
});

function saveDonates() {
  fs.writeFileSync("./database/donates.json", JSON.stringify(donates, null, "\t"));
}

setInterval(async () => {
  if(!donates.length) return;

  for (var i = 0; i < donates.length; i++) {
    console.log(donates[i].don.pide)
    if (donates[i].don.pide === false) {
      //const user = await newMongo.findOne({ id: Number(donates[i].comment)});
  qiwi
    .getBillInfo(donates[i].don.billId)
    .then((data) => {
      if (data.status.value === "WAITING") {
return;
      }
      if (data.status.value === "PAID") {
        console.log("Оплачено");
        let donate = donates.find(e => e.don.billId === i);
        donate.don.pide = true;
        saveDonates()
        vk.api.messages.send({
          user_id: Number(donates[i - 1].don.comment),
          random_id: 0,
          message: `🔥 Поступил платёж в размере ${donates[i - 1].don.amount} RUB, чтобы проверить баланс отправьте > баланс`
        })
       
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
}, 3000);

module.exports = router;
