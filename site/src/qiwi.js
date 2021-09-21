const confg = require("../qiwi.json");

const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const qiwi = new QiwiBillPaymentsAPI(confg.secretToken);

module.exports = qiwi;