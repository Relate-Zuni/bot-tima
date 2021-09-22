const tmp = require("../tmp/config.json");

const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const qiwi = new QiwiBillPaymentsAPI(tmp.qiwiTokenSecret);

module.exports = qiwi;