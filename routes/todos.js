const { Router } = require('express')
const router = Router()

const SECRET_KEY = "b296c0fd3b3c9bec23913a4723ff65a5";
const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

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
      name: 'Bot-tima launched...'
    })
  })

  router.post('/donate', async (req, res) => {
    if(!req.body.id) return;
    if(!req.body.amount) return;

    res.redirect(createOplata(req.body.id, req.body.amount))
  })  

module.exports = router