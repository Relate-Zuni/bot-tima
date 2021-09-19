const { Router } = require('express')
const router = Router()

const SECRET_KEY = "b296c0fd3b3c9bec23913a4723ff65a5";
const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

let errorSend = '';

function random(x, y) {
  return y
    ? Math.round(Math.random() * (y - x)) + x
    : Math.round(Math.random() * x);
}

function createOplata(senderId, number) {

  publicKey = "48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPri6NwjQGu8oapsXnSfktf2hYS3bxPLxPq9x2NSo2f7kvEHHT2xL8Hbd2GH8KieYJzjGgA4ggu18cEbRxoeQwB8Qpbiu7KcyBwQyguXpNv"

const params = {
  publicKey,
  billId: random(1000000,2000000),
  amount: number,
  comment: senderId,
  successUrl: "https://vk.me/jimbobott",
};

return qiwiApi.createPaymentForm(params);
}


router.get('/', (req, res) => {
    res.render('index', {
      error: errorSend
    })
  })

  router.post('/donate', async (req, res) => {
    let usersModel = require("../src/connect");
    if(!req.body.id) {
      res.redirect('/')
       return errorSend = 'Введите ID!'
    }
    if(!req.body.amount) {
      res.redirect('/')
      return errorSend = 'Введите количество донатной валюты!'
   }

    let user = await usersModel.find({ id: req.body.id});

    if(!user.length) { 
      res.redirect('/')
      return errorSend = 'Такой ID нет в системе!';
     }

    res.redirect(createOplata(req.body.id, req.body.amount))
  })  

module.exports = router